package com.vapor.servlets;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;
import com.vapor.config.DatabaseConfig;
import com.vapor.models.User;
import org.bson.Document;
import org.bson.conversions.Bson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;
import java.util.regex.Pattern;

@WebServlet("/api/users/*")
public class UserServlet extends HttpServlet {
    private MongoCollection<Document> usersCollection;
    private ObjectMapper objectMapper;

    @Override
    public void init() throws ServletException {
        MongoDatabase database = DatabaseConfig.getDatabase();
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
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("{\"error\":\"User ID required\"}");
                return;
            }
            
            String userId = pathInfo.substring(1);
            Document userDoc = usersCollection.find(Filters.eq("_id", new org.bson.types.ObjectId(userId))).first();
            
            if (userDoc != null) {
                // Remove password from response for security
                userDoc.remove("password");
                resp.getWriter().write(objectMapper.writeValueAsString(userDoc));
            } else {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                resp.getWriter().write("{\"error\":\"User not found\"}");
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
            User user = objectMapper.readValue(req.getReader(), User.class);
            
            // Validate input
            if (user.getUsername() == null || user.getEmail() == null || user.getPassword() == null) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("{\"error\":\"Username, email, and password are required\"}");
                return;
            }
            
            // Check if username or email already exists
            Bson usernameFilter = Filters.eq("username", user.getUsername());
            Bson emailFilter = Filters.eq("email", user.getEmail());
            
            if (usersCollection.find(usernameFilter).first() != null) {
                resp.setStatus(HttpServletResponse.SC_CONFLICT);
                resp.getWriter().write("{\"error\":\"Username already exists\"}");
                return;
            }
            
            if (usersCollection.find(emailFilter).first() != null) {
                resp.setStatus(HttpServletResponse.SC_CONFLICT);
                resp.getWriter().write("{\"error\":\"Email already exists\"}");
                return;
            }
            
            // Set default values
            if (user.getDisplayName() == null) {
                user.setDisplayName(user.getUsername());
            }
            user.setCreatedAt(new Date());
            user.setLastLogin(new Date());
            
            Document userDoc = user.toDocument();
            usersCollection.insertOne(userDoc);
            
            // Remove password from response
            userDoc.remove("password");
            
            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write("{\"message\":\"User created successfully\",\"id\":\"" + 
                userDoc.getObjectId("_id").toString() + "\"}");
                
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
                resp.getWriter().write("{\"error\":\"User ID required\"}");
                return;
            }
            
            String userId = pathInfo.substring(1);
            User user = objectMapper.readValue(req.getReader(), User.class);
            
            Bson filter = Filters.eq("_id", new org.bson.types.ObjectId(userId));
            
            // Build update document dynamically based on provided fields
            if (user.getDisplayName() != null) {
                usersCollection.updateOne(filter, Updates.set("displayName", user.getDisplayName()));
            }
            if (user.getVaporPoints() >= 0) {
                usersCollection.updateOne(filter, Updates.set("vaporPoints", user.getVaporPoints()));
            }
            if (user.getOwnedGames() != null) {
                usersCollection.updateOne(filter, Updates.set("ownedGames", user.getOwnedGames()));
            }
            if (user.getWishlist() != null) {
                usersCollection.updateOne(filter, Updates.set("wishlist", user.getWishlist()));
            }
            
            resp.getWriter().write("{\"message\":\"User updated successfully\"}");
            
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
                resp.getWriter().write("{\"error\":\"User ID required\"}");
                return;
            }
            
            String userId = pathInfo.substring(1);
            Bson filter = Filters.eq("_id", new org.bson.types.ObjectId(userId));
            
            usersCollection.deleteOne(filter);
            
            resp.getWriter().write("{\"message\":\"User deleted successfully\"}");
            
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
}
