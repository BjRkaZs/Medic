package com.example;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Scanner;
import java.util.Set;

public class DataSource {
    public ArrayList<Medicine> readFile() {
        try {
            return tryReadFile();
        } catch (FileNotFoundException e) {
            System.err.println("File not Found Error: " + e.getMessage());
            return null;
        }
    }

    private String[] medicationForms = {
        "tabletta", "kapszula", "injekció", "infúzió", "por", "oldat", 
        "szuszpenzió", "koncentrátum", "gél", "krém", "pezsgőtabletta",
        "spray", "kenőcs",
        "filmtabletta", "retard tabletta", "diszperziós tabletta",
        "oldatos injekció", "szuszpenziós injekció", 
        "por oldatos injekcióhoz", "por oldatos infúzióhoz",
        "por és oldószer", "kemény kapszula", "lágy kapszula",
        "diszperziós infúzió", "oldatos infúzió",
        "előretöltött fecskendő", "előretöltött injekciós toll",
        "belsőleges oldat", "külsőleges oldat",
        "szájban diszpergálódó tabletta", "rágótabletta",
        "granulátum", "implantátum", "tapasz",
        "végbélkúp", "hüvelygyűrű", "hüvelytabletta",
        "inhalációs por", "szemcsepp", "emulzió",
        "transzdermális tapasz", "bukkális tabletta",
        "oldatos szemcsepp", "belsőleges szuszpenzió"
    };
    
    public String extractForm(String fullName) {
        String lowercaseName = fullName.toLowerCase();
        for (String form : medicationForms) {
            if (lowercaseName.contains(form.toLowerCase())) {
                return form;
            }
        }
        return null;
    }

    public ArrayList<Medicine> tryReadFile() throws FileNotFoundException {
        ArrayList<Medicine> medList = new ArrayList<>();
        Set<String> uniqueNameForms = new HashSet<>();
        File file = new File("writeToDb\\src\\main\\resources\\gyogyszerek.csv");
        Scanner sc = new Scanner(file, "ISO-8859-2");
        sc.nextLine();
        while (sc.hasNextLine()) {
            String line = sc.nextLine();
            String[] lineArray = line.split(";");
            try {
                String fullName = lineArray[0].trim();
                if (fullName.matches("^[0-9].*") || 
                    fullName.matches("^[^a-zA-Z].*") ||
                    fullName.isEmpty() ||
                    lineArray.length < 2 || 
                    lineArray[1].trim().isEmpty()) {
                    continue;
                }

                Medicine med = new Medicine();
                String[] parts = fullName.split(" ");
                StringBuilder name = new StringBuilder();
                for (String part : parts) {
                    if (part.matches(".*\\d+.*") || part.matches(".*[+/].*")) {
                        break;
                    }
                    if (extractForm(part) != null) {
                        break;
                    }
                    name.append(part).append(" ");
                }
                String medName = name.toString().trim();
                String form = extractForm(fullName);
                
                if (medName.isEmpty() || form == null) {
                    continue;
                }
                String nameFormKey = medName + "|" + form;
                if (uniqueNameForms.contains(nameFormKey)) {
                    continue;
                }
                uniqueNameForms.add(nameFormKey);
                
                med.setName(medName);
                med.setForm(form);
                med.setSubstance(lineArray[1].trim());
                
                medList.add(med);
                
            } catch (Exception e) {
                System.err.println("Error parsing line: " + line);
            }
        }
        sc.close();
        return medList;
    }
}
