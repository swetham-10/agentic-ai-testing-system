package com.swetha.aitesting.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor

@Table(
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"title","description"}
                )
        }
)

public class TestCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length=2000)
    private String description;

    @Column(length=3000)
    private String steps;

    @Column(length=2000)
    private String expectedResult;

    private String priority;

}