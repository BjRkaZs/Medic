package com.example;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Mariadb {
    public Connection connect() {
        try {
            return tryConnect();
        } catch (SQLException e) {
            System.err.println("Error connecting: " + e.getMessage());
            return null;
        }
    }

    public Connection tryConnect() throws SQLException {
        String user = "root";
        String pass = "";
        String url = "jdbc:mariadb://localhost:3306/medicine";
        return DriverManager.getConnection(url, user, pass);
    }
}
