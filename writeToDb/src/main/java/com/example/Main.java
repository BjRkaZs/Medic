package com.example;

import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        DataSource dataSource = new DataSource();
        ArrayList<Medicine> medicines = dataSource.readFile();

        if (medicines != null) {
            InsertData insertData = new InsertData();
            for (Medicine med : medicines) {
                insertData.insertData(med);
            }
        }
    }
}