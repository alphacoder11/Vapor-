package com.vapor.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DatabaseConfig {
    private static final Logger logger = LoggerFactory.getLogger(DatabaseConfig.class);
    private static final String DATABASE_NAME = "vapor_db";
    private static MongoClient mongoClient;
    private static MongoDatabase database;

    static {
        try {
            // MongoDB connection string - adjust as needed
            String connectionString = System.getenv().getOrDefault("MONGODB_URI", 
                "mongodb://localhost:27017");
            
            mongoClient = MongoClients.create(connectionString);
            database = mongoClient.getDatabase(DATABASE_NAME);
            
            logger.info("Successfully connected to MongoDB database: {}", DATABASE_NAME);
            
            // Test connection
            database.runCommand(new org.bson.Document("ping", 1));
            logger.info("MongoDB connection test successful");
            
        } catch (Exception e) {
            logger.error("Failed to connect to MongoDB: {}", e.getMessage());
            throw new RuntimeException("MongoDB connection failed", e);
        }
    }

    public static MongoDatabase getDatabase() {
        if (database == null) {
            throw new IllegalStateException("Database not initialized");
        }
        return database;
    }

    public static void closeConnection() {
        if (mongoClient != null) {
            mongoClient.close();
            logger.info("MongoDB connection closed");
        }
    }
}
