package com.example;

public class Medicine {
    private Integer id;
    private String name;
    private String form;
    private String substance;

    public Medicine() {}

    public Medicine(String name, String form, String substance) {
        this.name = name;
        this.form = form;
        this.substance = substance;
    }

    public Medicine(Integer id, String form, String name, String substance) {
        this.id = id;
        this.name = name;
        this.form = form;
        this.substance = substance;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSubstance() {
        return substance;
    }

    public void setSubstance(String substance) {
        this.substance = substance;
    }

    public String getForm() {
        return form;
    }

    public void setForm(String form) {
        this.form = form;
    }
}

