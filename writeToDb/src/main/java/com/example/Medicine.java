package com.example;

public class Medicine {
    private Integer id;
    private String nev;
    private String hatoanyag;

    public Medicine() {}

    public Medicine(String nev, String hatoanyag) {
        this.nev = nev;
        this.hatoanyag = hatoanyag;
    }

    public Medicine(Integer id, String nev, String hatoanyag) {
        this.id = id;
        this.nev = nev;
        this.hatoanyag = hatoanyag;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNev() {
        return nev;
    }

    public void setNev(String nev) {
        this.nev = nev;
    }

    public String getHatoanyag() {
        return hatoanyag;
    }

    public void setHatoanyag(String hatoanyag) {
        this.hatoanyag = hatoanyag;
    }
}
