package com.vapor.util;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.vapor.config.DatabaseConfig;
import com.vapor.models.Game;
import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import java.util.Arrays;
import java.util.Date;

@WebListener
public class DataInitializer implements ServletContextListener {
    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        logger.info("Initializing database data...");
        
        try {
            MongoDatabase database = DatabaseConfig.getDatabase();
            MongoCollection<Document> gamesCollection = database.getCollection("games");
            
            // Check if games collection is empty
            if (gamesCollection.countDocuments() == 0) {
                logger.info("Games collection is empty, populating with sample data...");
                populateSampleGames(gamesCollection);
            }
            
        } catch (Exception e) {
            logger.error("Error initializing database data: {}", e.getMessage());
        }
    }

    private void populateSampleGames(MongoCollection<Document> gamesCollection) {
        Game[] sampleGames = {
            createGame("Elden Ring", "FromSoftware's latest epic action RPG", 59.99, "RPG", 
                "2022-02-25", "FromSoftware", "Bandai Namco", 
                "https://example.com/elden-ring.jpg", "https://www.youtube.com/embed/dQw4w9WgXcQ", 4.8, 
                Arrays.asList("Action", "RPG", "Fantasy", "Open World"), true, false),
            
            createGame("Cyberpunk 2077", "Open-world RPG set in Night City", 49.99, "RPG", 
                "2020-12-10", "CD Projekt Red", "CD Projekt", 
                "https://example.com/cyberpunk.jpg", "https://www.youtube.com/embed/8X2kI6btVQ8", 4.2, 
                Arrays.asList("RPG", "Sci-Fi", "Open World"), true, true),
            
            createGame("Red Dead Redemption 2", "Epic Western adventure", 39.99, "Action", 
                "2018-10-26", "Rockstar Games", "Rockstar Games", 
                "https://example.com/rdr2.jpg", "https://www.youtube.com/embed/eaW0tYkwocQ", 4.9, 
                Arrays.asList("Action", "Adventure", "Open World"), false, true),
            
            createGame("The Witcher 3: Wild Hunt", "Fantasy RPG masterpiece", 29.99, "RPG", 
                "2015-05-19", "CD Projekt Red", "CD Projekt", 
                "https://example.com/witcher3.jpg", "https://www.youtube.com/embed/cyj8DYUQ5_A", 4.9, 
                Arrays.asList("RPG", "Fantasy", "Open World"), false, true),
            
            createGame("Counter-Strike 2", "Competitive tactical shooter", 0.00, "FPS", 
                "2023-09-27", "Valve", "Valve", 
                "https://example.com/cs2.jpg", "https://www.youtube.com/embed/Ig3WbUhv4tI", 4.5, 
                Arrays.asList("FPS", "Competitive", "Multiplayer"), true, false),
            
            createGame("GTA V", "Open-world crime saga", 29.99, "Action", 
                "2013-09-17", "Rockstar Games", "Rockstar Games", 
                "https://example.com/gtav.jpg", "https://www.youtube.com/embed/Li9kZ7_0v8Q", 4.7, 
                Arrays.asList("Action", "Open World", "Crime"), false, false),
            
            createGame("Baldur's Gate 3", "D&D-based RPG", 59.99, "RPG", 
                "2023-08-03", "Larian Studios", "Larian Studios", 
                "https://example.com/bg3.jpg", "https://www.youtube.com/embed/1T4zWxJn4hM", 4.9, 
                Arrays.asList("RPG", "Turn-Based", "Fantasy"), true, false),
            
            createGame("Hollow Knight", "Metroidvania adventure", 14.99, "Indie", 
                "2017-02-24", "Team Cherry", "Team Cherry", 
                "https://example.com/hollow-knight.jpg", "https://www.youtube.com/embed/36Lid7S9c3o", 4.8, 
                Arrays.asList("Indie", "Metroidvania", "Platformer"), false, true)
        };

        for (Game game : sampleGames) {
            Document gameDoc = game.toDocument();
            gamesCollection.insertOne(gameDoc);
            logger.info("Added game: {}", game.getTitle());
        }
        
        logger.info("Sample games data populated successfully");
    }

    private Game createGame(String title, String description, double price, String genre, 
                           String releaseDate, String developer, String publisher, 
                           String imageUrl, String trailerUrl, double rating, java.util.List<String> tags, 
                           boolean featured, boolean onSale) {
        Game game = new Game();
        game.setTitle(title);
        game.setDescription(description);
        game.setPrice(price);
        game.setDiscountPrice(onSale ? price * 0.75 : 0.0); // 25% discount if on sale
        game.setGenre(genre);
        game.setReleaseDate(releaseDate);
        game.setDeveloper(developer);
        game.setPublisher(publisher);
        game.setImageUrl(imageUrl);
        game.setTrailerUrl(trailerUrl);
        game.setRating(rating);
        game.setTags(tags);
        game.setFeatured(featured);
        game.setOnSale(onSale);
        return game;
    }
}
