import { FillBlankExercise } from '../types/trainer';

export const fillBlanksData: FillBlankExercise[] = [
  {
    id: 'fb-polymorphism-virtual-override',
    title: 'Úloha 1: Dynamická vazba (VTABLE) u dědičnosti',
    category: 'Polymorfismus',
    description: 'Doplňte modifikátory metod tak, aby se u proměnné typu Zamestnanec zavolala přepsaná metoda potomka Programator.',
    codeTemplate: `public class Zamestnanec
{
    // 1. Předek povoluje přepsání metody v podtřídách:
    public {{blank_1}} void SpocitejMzdu()
    {
        Console.WriteLine("Základní mzda");
    }
}

public class Programator : Zamestnanec
{
    // 2. Potomek přepisuje metodu v tabulce virtuálních metod (vtable):
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
        placeholder: '[ 1 ]',
        explanation: "'virtual' oznamuje kompilátoru, že metoda má výchozí tělo, ale potomci ji mohou polymorfně přepsat."
      },
      {
        id: 'blank_2',
        correctAnswers: ['override'],
        options: ['override', 'new', 'virtual', 'static'],
        placeholder: '[ 2 ]',
        explanation: "'override' přepíše záznam ve VTABLE, takže volání i přes referenci typu Zamestnanec zavolá kód potomka."
      }
    ],
    runnableFullCode: `using System;

public class Zamestnanec
{
    public {{blank_1}} void SpocitejMzdu() => Console.WriteLine("Základní mzda");
}

public class Programator : Zamestnanec
{
    public {{blank_2}} void SpocitejMzdu() => Console.WriteLine("Mzda s IT bonusem");
}

public class Program
{
    public static void Main()
    {
        Zamestnanec z = new Programator();
        z.SpocitejMzdu();
    }
}`
  },

  {
    id: 'fb-constructor-base-chaining',
    title: 'Úloha 2: Volání konstruktoru předka',
    category: 'Dědičnost',
    description: 'Předek Osoba nemá bezparametrický konstruktor. Doplňte syntaxi v hlavičce konstruktoru potomka pro předání jména předkovi.',
    codeTemplate: `public class Osoba
{
    public string Jmeno { get; }
    public Osoba(string jmeno) => Jmeno = jmeno;
}

public class Student : Osoba
{
    public int Rocnik { get; }

    // Volání konstruktoru předka před tělem konstruktoru:
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
        placeholder: '[ 1 ]',
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
    public Student(string jmeno, int rocnik) {{blank_1}}(jmeno)
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
    title: 'Úloha 3: Statické zastínění metody předka',
    category: 'Zkouškové chytáky',
    description: 'Metoda v předkovi NENÍ virtuální. Doplňte klíčové slovo, které metodu v potomkovi úmyslně zastíní (method hiding).',
    codeTemplate: `public class Rodic
{
    public void Pozdrav() => Console.WriteLine("Ahoj od rodiče");
}

public class Dite : Rodic
{
    // Zastínění: váže se staticky podle typu proměnné (vlevo), nikoliv podle objektu v RAM
    public {{blank_1}} void Pozdrav() => Console.WriteLine("Čau od dítěte");
}`,
    blanks: [
      {
        id: 'blank_1',
        correctAnswers: ['new'],
        options: ['new', 'override', 'virtual', 'shadow'],
        placeholder: '[ 1 ]',
        explanation: "Klíčové slovo 'new' u metody skryje metodu předka. Pozor u zkoušky: Rodic r = new Dite(); r.Pozdrav(); vypíše 'Ahoj od rodiče'!"
      }
    ],
    runnableFullCode: `using System;

public class Rodic
{
    public void Pozdrav() => Console.WriteLine("Ahoj od rodiče");
}

public class Dite : Rodic
{
    public {{blank_1}} void Pozdrav() => Console.WriteLine("Čau od dítěte");
}

public class Program
{
    public static void Main()
    {
        Rodic r = new Dite();
        r.Pozdrav();
    }
}`
  },

  {
    id: 'fb-safe-downcasting-is-as',
    title: 'Úloha 4: Bezpečný downcasting bez InvalidCastException',
    category: 'Typový systém',
    description: 'Doplňte operátory pro bezpečné ověření typu s uložením do proměnné a pro bezpečné přetypování vracející null.',
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
        // 1. Ověří, zda je v 'z' opravdu Pes, a rovnou ho uloží do 'p':
        if (z {{blank_1}} Pes p)
        {
            p.Aportuj();
        }

        // 2. Zkusí přetypovat; když to nevyjde, nevyhodí výjimku, ale vrátí null:
        Pes? pesOdkaz = z {{blank_2}} Pes;
    }
}`,
    blanks: [
      {
        id: 'blank_1',
        correctAnswers: ['is'],
        options: ['is', 'as', 'instanceof', 'typeof'],
        placeholder: '[ 1 ]',
        explanation: "'is' otestuje skutečný typ objektu v RAM a při shodě rovnou naplní proměnnou 'p'."
      },
      {
        id: 'blank_2',
        correctAnswers: ['as'],
        options: ['as', 'is', 'cast', 'to'],
        placeholder: '[ 2 ]',
        explanation: "'as' provede bezpečné přetypování referenčního typu – při neshodě vrátí null místo vyhození InvalidCastException."
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
        if (z {{blank_1}} Pes p)
        {
            p.Aportuj();
        }
        Pes? pesOdkaz = z {{blank_2}} Pes;
        Console.WriteLine(pesOdkaz != null ? "Přetypováno úspěšně" : "Null");
    }
}`
  },

  {
    id: 'fb-composition-dependency-injection',
    title: 'Úloha 5: Kompozice a zapouzdření (Základ Proxy a Adaptéru)',
    category: 'Návrhové vzory',
    description: 'Doplňte modifikátory pro soukromé pole nastavené pouze v konstruktoru a připojení rozhraní k třídě.',
    codeTemplate: `public interface IPlatebniBrana
{
    void Zaplat(decimal castka);
}

public class BezpecnostniProxy {{blank_1}} IPlatebniBrana
{
    // Soukromá neměnná reference na vnitřní objekt (kompozice):
    {{blank_2}} IPlatebniBrana _vnitrniBrana;

    public BezpecnostniProxy(IPlatebniBrana brana)
    {
        _vnitrniBrana = brana;
    }

    public void Zaplat(decimal castka) => _vnitrniBrana.Zaplat(castka);
}`,
    blanks: [
      {
        id: 'blank_1',
        correctAnswers: [':'],
        options: [':', 'implements', 'extends', '->'],
        placeholder: '[ 1 ]',
        explanation: "V C# se implementace rozhraní i dědičnost třídy zapisuje dvojtečkou ':'."
      },
      {
        id: 'blank_2',
        correctAnswers: ['private readonly', 'readonly private'],
        options: ['private readonly', 'public static', 'protected virtual', 'internal const'],
        placeholder: '[ 2 ]',
        explanation: "'private readonly' zajistí zapouzdření vnitřního objektu a zaručí, že referenci lze nastavit pouze v konstruktoru."
      }
    ],
    runnableFullCode: `using System;

public interface IPlatebniBrana { void Zaplat(decimal castka); }
public class Karta : IPlatebniBrana { public void Zaplat(decimal c) => Console.WriteLine($"Platba {c} Kč kartou"); }

public class BezpecnostniProxy {{blank_1}} IPlatebniBrana
{
    {{blank_2}} IPlatebniBrana _vnitrniBrana;
    public BezpecnostniProxy(IPlatebniBrana brana) => _vnitrniBrana = brana;
    public void Zaplat(decimal castka) => _vnitrniBrana.Zaplat(castka);
}

public class Program
{
    public static void Main()
    {
        IPlatebniBrana proxy = new BezpecnostniProxy(new Karta());
        proxy.Zaplat(500);
    }
}`
  },

  {
    id: 'fb-singleton-pattern',
    title: 'Úloha 6: Návrhový vzor Singleton (Jedináček)',
    category: 'Vytvářející vzory',
    description: 'Doplňte modifikátor konstruktoru a statické vlastnosti tak, aby šlo vytvořit právě jednu instanci v celém programu.',
    codeTemplate: `public class KonfiguraceSingleton
{
    private static KonfiguraceSingleton? _instance;

    // 1. Zakáže volání 'new KonfiguraceSingleton()' zvenčí:
    {{blank_1}} KonfiguraceSingleton() { }

    // 2. Globální přístupový bod volaný přímo na třídě:
    public {{blank_2}} KonfiguraceSingleton Instance
    {
        get
        {
            if (_instance == null)
                _instance = new KonfiguraceSingleton();
            return _instance;
        }
    }
}`,
    blanks: [
      {
        id: 'blank_1',
        correctAnswers: ['private'],
        options: ['private', 'protected', 'public', 'internal'],
        placeholder: '[ 1 ]',
        explanation: "Konstruktor Singletonu MUSÍ být 'private', jinak by kdokoliv zvenčí mohl zavolat new KonfiguraceSingleton()."
      },
      {
        id: 'blank_2',
        correctAnswers: ['static'],
        options: ['static', 'virtual', 'abstract', 'readonly'],
        placeholder: '[ 2 ]',
        explanation: "Vlastnost Instance musí být 'static', aby se volala přímo na třídě (KonfiguraceSingleton.Instance)."
      }
    ],
    runnableFullCode: `using System;

public class KonfiguraceSingleton
{
    private static KonfiguraceSingleton? _instance;
    {{blank_1}} KonfiguraceSingleton() { }

    public {{blank_2}} KonfiguraceSingleton Instance
    {
        get
        {
            if (_instance == null)
                _instance = new KonfiguraceSingleton();
            return _instance;
        }
    }
}

public class Program
{
    public static void Main()
    {
        var a = KonfiguraceSingleton.Instance;
        var b = KonfiguraceSingleton.Instance;
        Console.WriteLine($"Stejná instance v RAM? {ReferenceEquals(a, b)}");
    }
}`
  },

  {
    id: 'fb-abstract-class-method',
    title: 'Úloha 7: Abstraktní třída a vynucené přepsání metody',
    category: 'Dědičnost & OOP',
    description: 'Doplňte klíčová slova pro abstraktní třídu a metodu bez těla, kterou musí každý potomek naimplementovat.',
    codeTemplate: `// 1. Třídu nelze vytvořit přes new Savci(), slouží jako společný základ:
public {{blank_1}} class Savci
{
    // 2. Metoda nemá žádné tělo { }, potomek ji MUSÍ přepsat:
    public {{blank_2}} void VydejZvuk();
}

public class Pes : Savci
{
    // 3. Potomek dodává povinnou implementaci:
    public {{blank_3}} void VydejZvuk()
    {
        Console.WriteLine("Haf!");
    }
}`,
    blanks: [
      {
        id: 'blank_1',
        correctAnswers: ['abstract'],
        options: ['abstract', 'virtual', 'interface', 'static'],
        placeholder: '[ 1 ]',
        explanation: "'abstract' před class říká, že třída je neúplná a nelze z ní přímo vytvořit instanci přes new."
      },
      {
        id: 'blank_2',
        correctAnswers: ['abstract'],
        options: ['abstract', 'virtual', 'override', 'extern'],
        placeholder: '[ 2 ]',
        explanation: "'abstract' metoda nemá tělo (končí středníkem) a nutí každého neabstraktního potomka napsat override."
      },
      {
        id: 'blank_3',
        correctAnswers: ['override'],
        options: ['override', 'new', 'virtual', 'implements'],
        placeholder: '[ 3 ]',
        explanation: "Potomek implementuje abstraktní metodu předka pomocí klíčového slova 'override'."
      }
    ],
    runnableFullCode: `using System;

public {{blank_1}} class Savci
{
    public {{blank_2}} void VydejZvuk();
}

public class Pes : Savci
{
    public {{blank_3}} void VydejZvuk() => Console.WriteLine("Haf!");
}

public class Program
{
    public static void Main()
    {
        Savci zvire = new Pes();
        zvire.VydejZvuk();
    }
}`
  }
];
