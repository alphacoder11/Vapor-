package com.vapor.models;

import org.bson.Document;
import java.util.List;

public class Game {
    private String id;
    private String title;
    private String description;
    private double price;
    private double discountPrice;
    private String genre;
    private String releaseDate;
    private String developer;
    private String publisher;
    private String imageUrl;
    private String trailerUrl;
    private double rating;
    private List<String> tags;
    private boolean featured;
    private boolean onSale;

    public Game() {}

    public Game(Document doc) {
        this.id = doc.getObjectId("_id").toString();
        this.title = doc.getString("title");
        this.description = doc.getString("description");
        this.price = doc.getDouble("price");
        this.discountPrice = doc.containsKey("discountPrice") ? doc.getDouble("discountPrice") : 0.0;
        this.genre = doc.getString("genre");
        this.releaseDate = doc.getString("releaseDate");
        this.developer = doc.getString("developer");
        this.publisher = doc.getString("publisher");
        this.imageUrl = doc.getString("imageUrl");
        this.trailerUrl = doc.containsKey("trailerUrl") ? doc.getString("trailerUrl") : null;
        this.rating = doc.containsKey("rating") ? doc.getDouble("rating") : 0.0;
        this.tags = doc.getList("tags", String.class);
        this.featured = doc.containsKey("featured") ? doc.getBoolean("featured") : false;
        this.onSale = doc.containsKey("onSale") ? doc.getBoolean("onSale") : false;
    }

    public Document toDocument() {
        Document doc = new Document();
        doc.append("title", title);
        doc.append("description", description);
        doc.append("price", price);
        doc.append("discountPrice", discountPrice);
        doc.append("genre", genre);
        doc.append("releaseDate", releaseDate);
        doc.append("developer", developer);
        doc.append("publisher", publisher);
        doc.append("imageUrl", imageUrl);
        doc.append("trailerUrl", trailerUrl);
        doc.append("rating", rating);
        doc.append("tags", tags);
        doc.append("featured", featured);
        doc.append("onSale", onSale);
        return doc;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public double getDiscountPrice() { return discountPrice; }
    public void setDiscountPrice(double discountPrice) { this.discountPrice = discountPrice; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public String getReleaseDate() { return releaseDate; }
    public void setReleaseDate(String releaseDate) { this.releaseDate = releaseDate; }

    public String getDeveloper() { return developer; }
    public void setDeveloper(String developer) { this.developer = developer; }

    public String getPublisher() { return publisher; }
    public void setPublisher(String publisher) { this.publisher = publisher; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getTrailerUrl() { return trailerUrl; }
    public void setTrailerUrl(String trailerUrl) { this.trailerUrl = trailerUrl; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }

    public boolean isOnSale() { return onSale; }
    public void setOnSale(boolean onSale) { this.onSale = onSale; }
}
