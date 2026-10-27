using System;

public class Osoba
{
    public string Jmeno { get; }
    public Osoba(string jmeno) => Jmeno = jmeno;
}

public class Student : Osoba
{
    public int Rocnik { get; }
    public Student(string jmeno, int rocnik) : base(jmeno)
    {
        Rocnik = rocnik;
    }
}

public class Program
{
    public static void Main()
    {
        Student s = new Student("Alice", 2);
        Console.WriteLine($"Student {s.Jmeno}, ročník {s.Rocnik}");
    }
}