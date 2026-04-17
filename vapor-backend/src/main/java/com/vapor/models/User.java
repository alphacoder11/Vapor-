package com.vapor.models;

import org.bson.Document;
import java.util.Date;
import java.util.List;

public class User {
    private String id;
    private String username;
    private String email;
    private String password;
    private String displayName;
    private int vaporPoints;
    private List<String> ownedGames;
    private List<String> wishlist;
    private Date createdAt;
    private Date lastLogin;

    public User() {}

    public User(Document doc) {
        this.id = doc.getObjectId("_id").toString();
        this.username = doc.getString("username");
        this.email = doc.getString("email");
        this.password = doc.getString("password");
        this.displayName = doc.getString("displayName");
        this.vaporPoints = doc.containsKey("vaporPoints") ? doc.getInteger("vaporPoints") : 0;
        this.ownedGames = doc.getList("ownedGames", String.class);
        this.wishlist = doc.getList("wishlist", String.class);
        this.createdAt = doc.getDate("createdAt");
        this.lastLogin = doc.getDate("lastLogin");
    }

    public Document toDocument() {
        Document doc = new Document();
        doc.append("username", username);
        doc.append("email", email);
        doc.append("password", password);
        doc.append("displayName", displayName);
        doc.append("vaporPoints", vaporPoints);
        doc.append("ownedGames", ownedGames);
        doc.append("wishlist", wishlist);
        doc.append("createdAt", createdAt);
        doc.append("lastLogin", lastLogin);
        return doc;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public int getVaporPoints() { return vaporPoints; }
    public void setVaporPoints(int vaporPoints) { this.vaporPoints = vaporPoints; }

    public List<String> getOwnedGames() { return ownedGames; }
    public void setOwnedGames(List<String> ownedGames) { this.ownedGames = ownedGames; }

    public List<String> getWishlist() { return wishlist; }
    public void setWishlist(List<String> wishlist) { this.wishlist = wishlist; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getLastLogin() { return lastLogin; }
    public void setLastLogin(Date lastLogin) { this.lastLogin = lastLogin; }
}
