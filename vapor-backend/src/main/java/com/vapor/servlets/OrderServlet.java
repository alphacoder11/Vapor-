package com.vapor.servlets;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;
import com.vapor.config.DatabaseConfig;
import com.vapor.models.Order;
import com.vapor.models.Game;
import com.vapor.models.User;
import org.bson.Document;
import org.bson.conversions.Bson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@WebServlet("/api/orders/*")
public class OrderServlet extends HttpServlet {
    private MongoCollection<Document> ordersCollection;
    private MongoCollection<Document> gamesCollection;
    private MongoCollection<Document> usersCollection;
    private ObjectMapper objectMapper;

    @Override
    public void init() throws ServletException {
        MongoDatabase database = DatabaseConfig.getDatabase();
        ordersCollection = database.getCollection("orders");
        gamesCollection = database.getCollection("games");
        usersCollection = database.getCollection("users");
        objectMapper = new ObjectMapper();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        try {
            String pathInfo = req.getPathInfo();
            
            if (pathInfo == null || pathInfo.equals("/")) {
                // Get all orders or filter by user
                String userId = req.getParameter("userId");
                List<Order> orders = new ArrayList<>();
                
                Bson filter = new Document();
                if (userId != null && !userId.isEmpty()) {
                    filter = Filters.eq("userId", userId);
                }
                
                for (Document doc : ordersCollection.find(filter)) {
                    orders.add(new Order(doc));
                }
                
                resp.getWriter().write(objectMapper.writeValueAsString(orders));
                
            } else {
                // Get specific order by ID
                String orderId = pathInfo.substring(1);
                Document orderDoc = ordersCollection.find(Filters.eq("_id", new org.bson.types.ObjectId(orderId))).first();
                
                if (orderDoc != null) {
                    Order order = new Order(orderDoc);
                    resp.getWriter().write(objectMapper.writeValueAsString(order));
                } else {
                    resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    resp.getWriter().write("{\"error\":\"Order not found\"}");
                }
            }
            
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        try {
            Order order = objectMapper.readValue(req.getReader(), Order.class);
            
            // Validate order
            if (order.getUserId() == null || order.getGameIds() == null || order.getGameIds().isEmpty()) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("{\"error\":\"User ID and game IDs are required\"}");
                return;
            }
            
            // Calculate total amount
            double totalAmount = 0.0;
            for (String gameId : order.getGameIds()) {
                Document gameDoc = gamesCollection.find(Filters.eq("_id", new org.bson.types.ObjectId(gameId))).first();
                if (gameDoc != null) {
                    Game game = new Game(gameDoc);
                    totalAmount += game.isOnSale() && game.getDiscountPrice() > 0 ? 
                        game.getDiscountPrice() : game.getPrice();
                }
            }
            
            order.setTotalAmount(totalAmount);
            order.setPointsEarned((int) (totalAmount * 100)); // 100 points per $1
            order.setOrderDate(new Date());
            order.setStatus("completed"); // For demo purposes
            
            Document orderDoc = order.toDocument();
            ordersCollection.insertOne(orderDoc);
            
            // Update user's owned games and vapor points
            Bson userFilter = Filters.eq("_id", new org.bson.types.ObjectId(order.getUserId()));
            Document userDoc = usersCollection.find(userFilter).first();
            
            if (userDoc != null) {
                User user = new User(userDoc);
                
                // Add games to owned games
                List<String> ownedGames = user.getOwnedGames();
                if (ownedGames == null) {
                    ownedGames = new ArrayList<>();
                }
                ownedGames.addAll(order.getGameIds());
                
                // Update vapor points
                int currentPoints = user.getVaporPoints();
                int newPoints = currentPoints + order.getPointsEarned();
                
                usersCollection.updateOne(userFilter, 
                    Updates.combine(
                        Updates.set("ownedGames", ownedGames),
                        Updates.set("vaporPoints", newPoints)
                    )
                );
            }
            
            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write("{\"message\":\"Order created successfully\",\"id\":\"" + 
                orderDoc.getObjectId("_id").toString() + "\",\"pointsEarned\":" + 
                order.getPointsEarned() + "}");
                
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
}
