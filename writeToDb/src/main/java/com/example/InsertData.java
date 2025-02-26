package com.example;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class InsertData {
    public void insertData(Medicine med) { 
        try {
            tryInsertData(med);
        } catch (SQLException e) {
            System.err.println("Error inserting data: " + e.getMessage());
        }
    }

    public void tryInsertData(Medicine med) throws SQLException {
        Mariadb db = new Mariadb();
        Connection conn = db.connect();
        if (conn == null) {
            System.err.println("Database connection is not established.");
            return;
        }

        String insert = "INSERT INTO medicine (name, form, substance) VALUES (?, ?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(insert)) {
            ps.setString(1, med.getName());
            ps.setString(2, med.getForm());
            ps.setString(3, med.getSubstance());
            ps.execute();
        } catch (SQLException e) {
            System.err.println("Error inserting data: " + e.getMessage());
        } finally {
            try {
                conn.close();
            } catch (SQLException e) {
                System.err.println("Error closing connection: " + e.getMessage());
            }
        }
    }
}
