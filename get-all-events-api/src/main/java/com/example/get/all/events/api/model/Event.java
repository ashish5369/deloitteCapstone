package com.example.get.all.events.api.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

@Document(collection = "events") // Maps to the "events" collection in MongoDB
public class Event {

    @Id
    private String id;

    private String title;
    private String description;
    private LocalDate date;
    private String location;
    private int capacity;
    private double price;

    private String vendorId; // Reference to the vendor's ID
    private List<Attendee> registeredAttendees; // List of attendees

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getVendorId() {
        return vendorId;
    }

    public void setVendorId(String vendorId) {
        this.vendorId = vendorId;
    }

    public List<Attendee> getRegisteredAttendees() {
        return registeredAttendees;
    }

    public void setRegisteredAttendees(List<Attendee> registeredAttendees) {
        this.registeredAttendees = registeredAttendees;
    }
}