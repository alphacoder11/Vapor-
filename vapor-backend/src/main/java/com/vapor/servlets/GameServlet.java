package com.vapor.servlets;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.vapor.config.DatabaseConfig;
import com.vapor.models.Game;
import org.bson.Document;
import org.bson.conversions.Bson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/api/games/*")
public class GameServlet extends HttpServlet {
    private MongoCollection<Document> gamesCollection;
    private ObjectMapper objectMapper;

    @Override
    public void init() throws ServletException {
        MongoDatabase database = DatabaseConfig.getDatabase();
        gamesCollection = database.getCollection("games");
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
                // Get all games or with filters
                List<Game> games = new ArrayList<>();
                
                // Check for query parameters
                String genre = req.getParameter("genre");
                String featured = req.getParameter("featured");
                String onSale = req.getParameter("onSale");
                String search = req.getParameter("search");
                
                Bson filter = new Document();
                if (genre != null && !genre.isEmpty()) {
                    filter = Filters.eq("genre", genre);
                }
                if (featured != null && featured.equals("true")) {
                    filter = Filters.and(filter, Filters.eq("featured", true));
                }
                if (onSale != null && onSale.equals("true")) {
                    filter = Filters.and(filter, Filters.eq("onSale", true));
                }
                if (search != null && !search.isEmpty()) {
                    filter = Filters.or(
                        Filters.regex("title", search, "i"),
                        Filters.regex("description", search, "i")
                    );
                }
                
                for (Document doc : gamesCollection.find(filter)) {
                    games.add(new Game(doc));
                }
                
                resp.getWriter().write(objectMapper.writeValueAsString(games));
                
            } else {
                // Get specific game by ID
                String gameId = pathInfo.substring(1);
                Document gameDoc = gamesCollection.find(Filters.eq("_id", new org.bson.types.ObjectId(gameId))).first();
                
                if (gameDoc != null) {
                    Game game = new Game(gameDoc);
                    resp.getWriter().write(objectMapper.writeValueAsString(game));
                } else {
                    resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    resp.getWriter().write("{\"error\":\"Game not found\"}");
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
            Game game = objectMapper.readValue(req.getReader(), Game.class);
            Document gameDoc = game.toDocument();
            
            gamesCollection.insertOne(gameDoc);
            
            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write("{\"message\":\"Game created successfully\",\"id\":\"" + 
                gameDoc.getObjectId("_id").toString() + "\"}");
                
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        try {
            String pathInfo = req.getPathInfo();
            if (pathInfo == null || pathInfo.equals("/")) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("{\"error\":\"Game ID required\"}");
                return;
            }
            
            String gameId = pathInfo.substring(1);
            Game game = objectMapper.readValue(req.getReader(), Game.class);
            
            Bson filter = Filters.eq("_id", new org.bson.types.ObjectId(gameId));
            Bson update = new Document("$set", game.toDocument());
            
            gamesCollection.updateOne(filter, update);
            
            resp.getWriter().write("{\"message\":\"Game updated successfully\"}");
            
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        try {
            String pathInfo = req.getPathInfo();
            if (pathInfo == null || pathInfo.equals("/")) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("{\"error\":\"Game ID required\"}");
                return;
            }
            
            String gameId = pathInfo.substring(1);
            Bson filter = Filters.eq("_id", new org.bson.types.ObjectId(gameId));
            
            gamesCollection.deleteOne(filter);
            
            resp.getWriter().write("{\"message\":\"Game deleted successfully\"}");
            
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
}
