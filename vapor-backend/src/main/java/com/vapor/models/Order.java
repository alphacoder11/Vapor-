package com.vapor.models;

import org.bson.Document;
import java.util.Date;
import java.util.List;

public class Order {
    private String id;
    private String userId;
    private List<String> gameIds;
    private double totalAmount;
    private int pointsEarned;
    private String status;
    private Date orderDate;
    private String paymentMethod;

    public Order() {}

    public Order(Document doc) {
        this.id = doc.getObjectId("_id").toString();
        this.userId = doc.getString("userId");
        this.gameIds = doc.getList("gameIds", String.class);
        this.totalAmount = doc.getDouble("totalAmount");
        this.pointsEarned = doc.getInteger("pointsEarned");
        this.status = doc.getString("status");
        this.orderDate = doc.getDate("orderDate");
        this.paymentMethod = doc.getString("paymentMethod");
    }

    public Document toDocument() {
        Document doc = new Document();
        doc.append("userId", userId);
        doc.append("gameIds", gameIds);
        doc.append("totalAmount", totalAmount);
        doc.append("pointsEarned", pointsEarned);
        doc.append("status", status);
        doc.append("orderDate", orderDate);
        doc.append("paymentMethod", paymentMethod);
        return doc;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public List<String> getGameIds() { return gameIds; }
    public void setGameIds(List<String> gameIds) { this.gameIds = gameIds; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public int getPointsEarned() { return pointsEarned; }
    public void setPointsEarned(int pointsEarned) { this.pointsEarned = pointsEarned; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Date getOrderDate() { return orderDate; }
    public void setOrderDate(Date orderDate) { this.orderDate = orderDate; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}
