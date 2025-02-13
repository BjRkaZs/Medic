package com.example;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Scanner;

public class DataSource {
    public ArrayList<Medicine> readFile() {
        try {
            return tryReadFile();
        } catch (FileNotFoundException e) {
            System.err.println("File not Found Error: " + e.getMessage());
            return null;
        }
    }

    public ArrayList<Medicine> tryReadFile() throws FileNotFoundException {
        ArrayList<Medicine> medList = new ArrayList<>();
        File file = new File(".\\src\\main\\resources\\gyogyszerek.csv");
        Scanner sc = new Scanner(file);
        sc.nextLine();
        while (sc.hasNextLine()) {
            String line = sc.nextLine();
            String[] lineArray = line.split(";");
            try {
                Medicine med = new Medicine();
                med.setNev(lineArray[0].trim());
                if(lineArray.length > 1 && lineArray[1] != null && !lineArray[1].equals(";") && !lineArray[1].trim().isEmpty())
                {
                    med.setHatoanyag(lineArray[1].trim());
                }
                medList.add(med);
            } catch (NumberFormatException e) {
                System.err.println("Error parsing line: " + e.getMessage());
            }
        }

        sc.close();

        return medList;
    }
}
