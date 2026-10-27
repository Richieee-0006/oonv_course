using System;

public class Program
{
    public abstract class Zamestnanec
    {
        public string Jmeno { get; set; }
        public int Plat { get; set; }

        // Povinný konstruktor předka
        public Zamestnanec(string jmeno, int plat)
        {
            Jmeno = jmeno;
            Plat = plat;
        }

        // Běžná metoda (statická vazba podle typu proměnné)
        public void PredstavSeObycejne()
        {
            Console.WriteLine($"[Obyčejně] Jsem zaměstnanec {Jmeno}");
        }

        // Virtuální metoda (dynamická vazba přes VTABLE podle objektu v RAM)
        public virtual void SpocitejBonus()
        {
            Console.WriteLine($"[Virtual Zamestnanec] Standardní bonus 10%: {Plat * 0.10} Kč");
        }
    }

    public class Programator : Zamestnanec
    {
        public string HlavniJazyk { get; set; }

        // CHYTÁK ZE ZKOUŠKY: Povinné volání : base(...)!
        public Programator(string jmeno, int plat, string jazyk) : base(jmeno, plat)
        {
            HlavniJazyk = jazyk;
        }

        // NEW = Zastínění (hiding) - přepíše metodu pouze při volání přes Programator typ!
        public new void PredstavSeObycejne()
        {
            Console.WriteLine($"[NEW Programator] Jsem programátor {Jmeno} v jazyce {HlavniJazyk}");
        }

        // OVERRIDE = Skutečný polymorfismus (přepíše záznam ve VTABLE)!
        public override void SpocitejBonus()
        {
            Console.WriteLine($"[OVERRIDE Programator] Speciální IT bonus 30%: {Plat * 0.30} Kč");
        }
    }

    public static void Main()
    {
        Console.WriteLine("=== ZKOUŠKOVÝ SCÉNÁŘ: VLEVO PŘEDEK, VPRAVO POTOMEK ===");
        // Mentální model:
        // VLEVO (Zamestnanec z): Nálepka na krabici pro Roslyn kompilátor
        // VPRAVO (new Programator): Reálný objekt alokovaný v RAM na Heap
        Zamestnanec z = new Programator("David", 80000, "C#");

        // 1. Zastínění 'new' se váže STATICKY podle typu vlevo (Zamestnanec)!
        z.PredstavSeObycejne(); 

        // 2. 'override' se váže DYNAMICKY přes vtable podle objektu v RAM (Programator)!
        z.SpocitejBonus();

        Console.WriteLine("\n=== UPCASTING & DOWNCASTING (is / as) ===");
        if (z is Programator p)
        {
            Console.WriteLine($"Safe downcast pomocí 'is': Programátor píše v {p.HlavniJazyk}");
            p.PredstavSeObycejne(); // Zde je typ vlevo Programator, zavolá se nová metoda
        }

        Programator? testAs = z as Programator;
        Console.WriteLine($"Safe downcast pomocí 'as': {(testAs != null ? "Úspěch" : "Selhalo")}");
    }
}