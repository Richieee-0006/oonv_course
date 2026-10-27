import { QuizQuestion } from '../types/trainer';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'quiz-method-shadowing-new',
    title: 'Zkouškový chyták č. 1: override vs new na proměnné předka',
    category: 'polymorphism',
    codeSnippet: `using System;

public class Rodic
{
    public void PozdravObycejne() => Console.WriteLine("Rodič obyčejně");
    public virtual void PozdravVirtualne() => Console.WriteLine("Rodič virtuálně");
}

public class Potomek : Rodic
{
    public new void PozdravObycejne() => Console.WriteLine("Potomek nově");
    public override void PozdravVirtualne() => Console.WriteLine("Potomek override");
}

public class Program
{
    public static void Main()
    {
        Rodic r = new Potomek();
        r.PozdravObycejne();
        r.PozdravVirtualne();
    }
}`,
    options: [
      { id: 'a', text: 'Potomek nově\nPotomek override', isCorrect: false },
      { id: 'b', text: 'Rodič obyčejně\nPotomek override', isCorrect: true },
      { id: 'c', text: 'Rodič obyčejně\nRodič virtuálně', isCorrect: false },
      { id: 'd', text: 'Kód nelze zkompilovat kvůli chybě CS0108', isCorrect: false }
    ],
    explanation: 'Zlatý zkouškový chyták! Proměnná r má typ Rodic (vlevo). Protože PozdravObycejne() používá "new", kompilátor použije STATICKOU VAZBU podle typu proměnné (Rodic). Naopak PozdravVirtualne() má "override", takže se uplatní DYNAMICKÁ VAZBA přes tabulku virtuálních metod (VTABLE) a zavolá se objekt v RAM (Potomek).',
    memoryDiagramNote: 'Vlevo: Rodic r (statický typ kompilátoru) -> Vpravo: new Potomek() v RAM (vtable odkazuje na Potomek.PozdravVirtualne).'
  },

  {
    id: 'quiz-string-immutability',
    title: 'Zkouškový chyták č. 2: String immutability',
    category: 'gotchas',
    codeSnippet: `using System;

public class Program
{
    public static void Main()
    {
        string text = "ahoj";
        text.ToUpper();
        Console.WriteLine(text);
    }
}`,
    options: [
      { id: 'a', text: 'AHOJ', isCorrect: false },
      { id: 'b', text: 'ahoj', isCorrect: true },
      { id: 'c', text: 'NullReferenceException', isCorrect: false },
      { id: 'd', text: 'Kompilátor vyhodí chybu', isCorrect: false }
    ],
    explanation: 'Typ string je v C# sice referenční typ na Heap, ale je IMMUTABLE (neměnný). Metoda text.ToUpper() nemění původní instanci, ale alokuje a vrací zcela NOVÝ string! Jelikož výsledek nebyl nikam přiřazen (např. text = text.ToUpper()), proměnná text zůstává nezměněna ("ahoj").'
  },

  {
    id: 'quiz-reference-aliasing-heap',
    title: 'Zkouškový chyták č. 3: Kopírování referencí na Stack vs Heap',
    category: 'memory',
    codeSnippet: `using System;

public class Uzivatel
{
    public string Jmeno { get; set; }
    public Uzivatel(string jmeno) => Jmeno = jmeno;
}

public class Program
{
    public static void Main()
    {
        Uzivatel a = new Uzivatel("Petr");
        Uzivatel b = a;
        b.Jmeno = "Honza";

        Console.WriteLine(a.Jmeno);
    }
}`,
    options: [
      { id: 'a', text: 'Petr', isCorrect: false },
      { id: 'b', text: 'Honza', isCorrect: true },
      { id: 'c', text: 'null', isCorrect: false },
      { id: 'd', text: 'Vyhodí výjimku za běhu', isCorrect: false }
    ],
    explanation: 'Třída Uzivatel je referenční typ. Na Stacku se vytvoří proměnná a, která ukazuje na paměťovou adresu na Heap. Přiřazení "b = a" nekopíruje objekt, ale zduplikuje POUZE adresu ukazatele na Stacku. Obě proměnné a i b ukazují na jediný objekt v RAM. Změna b.Jmeno se tedy projeví i na a.Jmeno.',
    memoryDiagramNote: 'Stack: [a: 0x1A40, b: 0x1A40] ---> Heap [0x1A40: Uzivatel { Jmeno = "Honza" }]'
  },

  {
    id: 'quiz-downcasting-exception',
    title: 'Zkouškový chyták č. 4: Explicitní přetypování vs operátor "as"',
    category: 'gotchas',
    codeSnippet: `using System;

public interface IZvire {}
public class Pes : IZvire {}
public class Kocka : IZvire {}

public class Program
{
    public static void Main()
    {
        IZvire z = new Kocka();
        Pes? p = z as Pes;
        Console.WriteLine(p == null ? "JeNull" : "NeniNull");
    }
}`,
    options: [
      { id: 'a', text: 'JeNull', isCorrect: true },
      { id: 'b', text: 'NeniNull', isCorrect: false },
      { id: 'c', text: 'InvalidCastException', isCorrect: false },
      { id: 'd', text: 'Kód se nezkompiluje', isCorrect: false }
    ],
    explanation: 'Operátor "as" provádí bezpečné přetypování. Pokud runtime typ neodpovídá cílovému typu (objekt v paměti je Kocka, nikoliv Pes), operátor "as" NEVYHODÍ InvalidCastException, ale bezpečně vrátí null. Kdyby bylo použito explicitní (Pes)z, vyhodila by se výjimka.'
  },

  {
    id: 'quiz-access-modifier-default',
    title: 'Zkouškový chyták č. 5: Výchozí viditelnost v C#',
    category: 'access',
    codeSnippet: `// V souboru Knihovna.cs:
class TajnyVypocet
{
    int _hodnota = 42;
    void Spocti() {}
}`,
    options: [
      { id: 'a', text: 'Třída je public, členy jsou public (jako v Java/Python)', isCorrect: false },
      { id: 'b', text: 'Třída je internal, členy jsou private', isCorrect: true },
      { id: 'c', text: 'Třída je private, členy jsou internal', isCorrect: false },
      { id: 'd', text: 'Třída je protected, členy jsou protected', isCorrect: false }
    ],
    explanation: 'V C# platí přísná pravidla pro výchozí viditelnost bez uvedení modifikátoru: Top-level třída deklarovaná v namespace/souboru je defaultně INTERNAL (viditelná jen v rámci projektu). Členy třídy (atributy, metody) jsou defaultně PRIVATE.'
  },

  {
    id: 'quiz-constructor-base-mandatory',
    title: 'Zkouškový chyták č. 6: Chybějící bezparametrický konstruktor předka',
    category: 'inheritance',
    codeSnippet: `public class Zamestnanec
{
    public Zamestnanec(string jmeno, int mzda) {}
}

public class Programator : Zamestnanec
{
    public Programator(string jmeno, int mzda)
    {
        // Chybí volání : base(...)
    }
}`,
    options: [
      { id: 'a', text: 'Zkompiluje se a automaticky předá null a 0', isCorrect: false },
      { id: 'b', text: 'Chyba kompilace: Zamestnanec neobsahuje konstruktor bez parametrů', isCorrect: true },
      { id: 'c', text: 'Zkompiluje se a vyhodí výjimku za běhu', isCorrect: false },
      { id: 'd', text: 'Zkompiluje se, pokud je Programator ve stejné sestavě', isCorrect: false }
    ],
    explanation: 'Pokud předek definuje konstruktor s parametry, kompilátor C# již negeneruje výchozí bezparametrický konstruktor. Každý odvozený konstruktor potomka MUSÍ explicitně zavolat : base(jmeno, mzda), jinak kompilátor Roslyn odmítne kód sestavit (CS7036).'
  }
];
