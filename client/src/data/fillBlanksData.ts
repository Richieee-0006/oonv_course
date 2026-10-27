import { FillBlankExercise } from '../types/trainer';

export const fillBlanksData: FillBlankExercise[] = [
  {
    id: 'fb-polymorphism-virtual-override',
    title: 'Řízený polymorfismus: virtual vs override',
    category: 'Polymorfismus',
    description: 'Doplňte správná klíčová slova pro dynamickou pozdní vazbu (vtable) mezi předkem a potomkem.',
    codeTemplate: `public class Zamestnanec
{
    // Předek umožňuje přepsání v podtřídě
    public {{blank_1}} void SpocitejMzdu()
    {
        Console.WriteLine("Základní mzda");
    }
}

public class Programator : Zamestnanec
{
    // Potomek skutečně dynamicky přepisuje záznam ve vtable
    public {{blank_2}} void SpocitejMzdu()
    {
        Console.WriteLine("Mzda s IT bonusem");
    }
}`,
    blanks: [
      {
        id: 'blank_1',
        correctAnswers: ['virtual'],
        options: ['virtual', 'abstract', 'new', 'sealed'],
        placeholder: 'klíčové slovo předka',
        explanation: "'virtual' oznamuje kompilátoru, že metoda má výchozí tělo, ale potomci ji mohou polymorfně přepsat."
      },
      {
        id: 'blank_2',
        correctAnswers: ['override'],
        options: ['override', 'new', 'virtual', 'static'],
        placeholder: 'klíčové slovo potomka',
        explanation: "'override' přepíše záznam ve VTABLE, takže volání i přes referenci typu Zamestnanec zavolá kód potomka."
      }
    ],
    runnableFullCode: `using System;

public class Zamestnanec
{
    public virtual void SpocitejMzdu() => Console.WriteLine("Základní mzda");
}

public class Programator : Zamestnanec
{
    public override void SpocitejMzdu() => Console.WriteLine("Mzda s IT bonusem");
}

public class Program
{
    public static void Main()
    {
        Zamestnanec z = new Programator();
        z.SpocitejMzdu(); // Vypíše: Mzda s IT bonusem
    }
}`
  },

  {
    id: 'fb-constructor-base-chaining',
    title: 'Povinné řetězení konstruktorů předka (: base)',
    category: 'Dědičnost',
    description: 'Předek nemá bezparametrický konstruktor. Doplňte předání parametrů předkovi.',
    codeTemplate: `public class Osoba
{
    public string Jmeno { get; }
    public Osoba(string jmeno) => Jmeno = jmeno;
}

public class Student : Osoba
{
    public int Rocnik { get; }

    // Volání konstruktoru předka před tělem konstruktoru
    public Student(string jmeno, int rocnik) {{blank_1}}(jmeno)
    {
        Rocnik = rocnik;
    }
}`,
    blanks: [
      {
        id: 'blank_1',
        correctAnswers: [': base', ':base'],
        options: [': base', ': this', 'super', 'extends'],
        placeholder: 'volání předka',
        explanation: "V C# se konstruktor předka volá v hlavičce před tělem pomocí ': base(...)'. V C# neexistuje 'super'."
      }
    ],
    runnableFullCode: `using System;

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
}`
  },

  {
    id: 'fb-method-hiding-new',
    title: 'Zastínění metody (hiding) pomocí "new"',
    category: 'Zkouškové chytáky',
    description: 'Doplňte klíčové slovo, které potlačí varování kompilátoru a provede statické zastínění (nikoliv vtable override).',
    codeTemplate: `public class Rodic
{
    public void Pozdrav() => Console.WriteLine("Ahoj od rodiče");
}

public class Dite : Rodic
{
    // Zastínění: váže se pouze staticky podle typu proměnné
    public {{blank_1}} void Pozdrav() => Console.WriteLine("Čau od dítěte");
}`,
    blanks: [
      {
        id: 'blank_1',
        correctAnswers: ['new'],
        options: ['new', 'override', 'virtual', 'shadow'],
        placeholder: 'klíčové slovo',
        explanation: "Klíčové slovo 'new' u metody potlačí varování kompilátoru a skryje metodu předka. Pozor: r.Pozdrav() zavolá rodiče, pokud je proměnná typu Rodic!"
      }
    ],
    runnableFullCode: `using System;

public class Rodic
{
    public void Pozdrav() => Console.WriteLine("Ahoj od rodiče");
}

public class Dite : Rodic
{
    public new void Pozdrav() => Console.WriteLine("Čau od dítěte");
}

public class Program
{
    public static void Main()
    {
        Rodic r = new Dite();
        r.Pozdrav(); // Vypíše: Ahoj od rodiče (kvůli 'new' došlo ke statické vazbě na Rodic!)
    }
}`
  },

  {
    id: 'fb-safe-downcasting-is-as',
    title: 'Bezpečné přetypování: Pattern Matching "is" a operátor "as"',
    category: 'Typový systém',
    description: 'Doplňte bezpečné testování typu a konverzi bez vyhození InvalidCastException.',
    codeTemplate: `public interface IZvire { void OzviSe(); }
public class Pes : IZvire 
{ 
    public void OzviSe() => Console.WriteLine("Haf");
    public void Aportuj() => Console.WriteLine("Aportuji míček!");
}

public class SpravceZvirat
{
    public void Testuj(IZvire z)
    {
        // 1. Pattern matching ověření typu a okamžité svázání proměnné
        if (z {{blank_1}} Pes p)
        {
            p.Aportuj();
        }

        // 2. Operátor pro vrácení null při neúspěchu
        Pes? pesOdkaz = z {{blank_2}} Pes;
    }
}`,
    blanks: [
      {
        id: 'blank_1',
        correctAnswers: ['is'],
        options: ['is', 'as', 'instanceof', 'typeof'],
        placeholder: 'pattern match',
        explanation: "'is' otestuje typ a pokud odpovídá, rovnou inicializuje proměnnou 'p'."
      },
      {
        id: 'blank_2',
        correctAnswers: ['as'],
        options: ['as', 'is', 'cast', 'to'],
        placeholder: 'safe cast',
        explanation: "'as' provede bezpečné přetypování - pokud objekt není daného typu, vrátí 'null' místo výjimky."
      }
    ],
    runnableFullCode: `using System;

public interface IZvire { void OzviSe(); }
public class Pes : IZvire 
{ 
    public void OzviSe() => Console.WriteLine("Haf");
    public void Aportuj() => Console.WriteLine("Aportuji míček!");
}

public class Program
{
    public static void Main()
    {
        IZvire z = new Pes();
        if (z is Pes p)
        {
            p.Aportuj();
        }
    }
}`
  },

  {
    id: 'fb-composition-dependency-injection',
    title: 'Kompozice a Dependency Injection (2. pravidlo GoF)',
    category: 'Návrhové vzory',
    description: 'Doplňte definici privátního neměnného pole pro uchování rozhraní předaného v konstruktoru.',
    codeTemplate: `public interface IPlatebniBrana
{
    void Zaplat(decimal castka);
}

public class NakupniKosik
{
    // Neměnná reference na rozhraní
    {{blank_1}} IPlatebniBrana _brana;

    public NakupniKosik(IPlatebniBrana brana)
    {
        _brana = brana;
    }
}`,
    blanks: [
      {
        id: 'blank_1',
        correctAnswers: ['private readonly', 'readonly private'],
        options: ['private readonly', 'public static', 'protected virtual', 'internal const'],
        placeholder: 'zapouzdření a neměnnost',
        explanation: "'private readonly' zajistí zapouzdření pole a zaručí, že referenci nelze po konstrukci nechtěně přepsat."
      }
    ],
    runnableFullCode: `using System;

public interface IPlatebniBrana { void Zaplat(decimal castka); }
public class Karta : IPlatebniBrana { public void Zaplat(decimal c) => Console.WriteLine($"Platba {c} Kč kartou"); }

public class NakupniKosik
{
    private readonly IPlatebniBrana _brana;
    public NakupniKosik(IPlatebniBrana brana) => _brana = brana;
    public void Dokoncit() => _brana.Zaplat(100);
}

public class Program
{
    public static void Main()
    {
        NakupniKosik kosik = new NakupniKosik(new Karta());
        kosik.Dokoncit();
    }
}`
  }
];
