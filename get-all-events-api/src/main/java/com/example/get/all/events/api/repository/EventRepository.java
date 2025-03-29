package com.example.get.all.events.api.repository;


import com.example.get.all.events.api.model.Event;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EventRepository extends MongoRepository<Event, String> {
}