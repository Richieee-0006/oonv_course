import { FourPartsPatternExercise } from '../types/trainer';

export const fourPartsData: FourPartsPatternExercise[] = [
  {
    id: 'fp-strategy',
    title: 'Vzor Strategy (Platební brána)',
    patternName: 'Strategy',
    pageReference: 'str. 16 z PDF - 4 části vzoru',
    scenario: 'Napište z hlavy kompletní vzor Strategy: 1. Rozhraní IPlatebniStrategie s metodou Zaplat(int castka); 2. Konkrétní strategii PlatbaKartou; 3. Kontext NakupniKosik držící privátní IPlatebniStrategie s metodou NastavStrategii a Zaplat; 4. Main() kde vlevo je rozhraní a vpravo třída.',
    part1Hint: '1. Rozhraní: public interface IPlatebniStrategie { void Zaplat(int castka); }',
    part2Hint: '2. Konkrétní produkt: public class PlatbaKartou : IPlatebniStrategie { public void Zaplat(int castka) { ... } }',
    part3Hint: '3. Samotný vzor: public class NakupniKosik { private IPlatebniStrategie? _strategie; ... }',
    part4Hint: '4. Main: IPlatebniStrategie metoda = new PlatbaKartou(); vlevo rozhraní, vpravo třída!',
    starterCode: `using System;

// 1. ČÁST: Rozhraní produktu / strategie
// TODO: Vytvořte rozhraní IPlatebniStrategie


// 2. ČÁST: Konkrétní produkt / strategie
// TODO: Vytvořte třídu PlatbaKartou implementující IPlatebniStrategie


// 3. ČÁST: Samotný vzor (Kontext)
// TODO: Vytvořte třídu NakupniKosik


// 4. ČÁST: Spuštění v Main (vlevo Rozhraní, vpravo Konkrétní třída)
public class Program
{
    public static void Main()
    {
        // TODO: IPlatebniStrategie platba = new PlatbaKartou();
    }
}`,
    solutionCode: `using System;

// 1. ČÁST: Rozhraní
public interface IPlatebniStrategie
{
    void Zaplat(int castka);
}

// 2. ČÁST: Konkrétní produkt
public class PlatbaKartou : IPlatebniStrategie
{
    public void Zaplat(int castka)
    {
        Console.WriteLine($"Platba kartou: {castka} Kč.");
    }
}

// 3. ČÁST: Samotný vzor
public class NakupniKosik
{
    private IPlatebniStrategie? _strategie;

    public void NastavStrategii(IPlatebniStrategie strategie)
    {
        _strategie = strategie;
    }

    public void Zaplatit(int castka)
    {
        if (_strategie != null)
        {
            _strategie.Zaplat(castka);
        }
        else
        {
            Console.WriteLine("Není zvolena platební metoda!");
        }
    }
}

// 4. ČÁST: Main - vlevo rozhraní, vpravo konkrétní třída
public class Program
{
    public static void Main()
    {
        // 1. Pravidlo GoF: vlevo rozhraní, vpravo třída!
        IPlatebniStrategie karta = new PlatbaKartou();

        NakupniKosik kosik = new NakupniKosik();
        kosik.NastavStrategii(karta);
        kosik.Zaplatit(1500);
    }
}`,
    validationRules: {
      expectedInterfaces: ['IPlatebniStrategie'],
      expectedClasses: ['PlatbaKartou', 'NakupniKosik'],
      expectedMainAssignments: [
        { leftType: 'IPlatebniStrategie', rightType: 'PlatbaKartou' }
      ]
    }
  },

  {
    id: 'fp-adapter',
    title: 'Vzor Objektový Adaptér (PayPal Adapter)',
    patternName: 'Adapter',
    pageReference: 'str. 16 z PDF & str. 3-4',
    scenario: 'Napište 4 části adaptéru: 1. Cílové rozhraní IPlatebniBrana (metoda ZaplatKc(int castka)); 2. Nekompatibilní Adaptee PayPalSluzba (SendUsd(double amount)); 3. Samotný vzor PayPalAdapter implementující IPlatebniBrana a obalující PayPalSluzba; 4. Main s polymorfní deklarací.',
    part1Hint: '1. Rozhraní: public interface IPlatebniBrana { void ZaplatKc(int castka); }',
    part2Hint: '2. Cizí třída: public class PayPalSluzba { public void SendUsd(double amount) { ... } }',
    part3Hint: '3. Adaptér: public class PayPalAdapter : IPlatebniBrana { private readonly PayPalSluzba _payPal; ... }',
    part4Hint: '4. Main: IPlatebniBrana brana = new PayPalAdapter(new PayPalSluzba());',
    starterCode: `using System;

// 1. ČÁST: Cílové rozhraní
// TODO: public interface IPlatebniBrana


// 2. ČÁST: Cizí nekompatibilní třída (Adaptee)
// TODO: public class PayPalSluzba


// 3. ČÁST: Adaptér (obaluje cizí třídu)
// TODO: public class PayPalAdapter : IPlatebniBrana


// 4. ČÁST: Main (vlevo rozhraní, vpravo třída)
public class Program
{
    public static void Main()
    {
        // TODO: IPlatebniBrana brana = new PayPalAdapter(...);
    }
}`,
    solutionCode: `using System;

// 1. ČÁST: Cílové rozhraní
public interface IPlatebniBrana
{
    void ZaplatKc(int castka);
}

// 2. ČÁST: Cizí třída (Adaptee)
public class PayPalSluzba
{
    public void SendUsd(double amount)
    {
        Console.WriteLine($"[PayPal] Zaplaceno {amount:F2} USD");
    }
}

// 3. ČÁST: Objektový adaptér
public class PayPalAdapter : IPlatebniBrana
{
    private readonly PayPalSluzba _payPal;

    public PayPalAdapter(PayPalSluzba payPal)
    {
        _payPal = payPal;
    }

    public void ZaplatKc(int castka)
    {
        double usd = castka / 25.0;
        _payPal.SendUsd(usd);
    }
}

// 4. ČÁST: Main (vlevo rozhraní, vpravo třída)
public class Program
{
    public static void Main()
    {
        IPlatebniBrana brana = new PayPalAdapter(new PayPalSluzba());
        brana.ZaplatKc(500);
    }
}`,
    validationRules: {
      expectedInterfaces: ['IPlatebniBrana'],
      expectedClasses: ['PayPalAdapter', 'PayPalSluzba'],
      expectedMainAssignments: [
        { leftType: 'IPlatebniBrana', rightType: 'PayPalAdapter' }
      ]
    }
  },

  {
    id: 'fp-decorator',
    title: 'Vzor Decorator (Káva)',
    patternName: 'Decorator',
    pageReference: 'str. 16 z PDF & str. 10-11',
    scenario: 'Napište 4 části dekorátoru: 1. Rozhraní IKava (ZiskejNazev(), SpocitejCenu()); 2. Základní třída Espresso; 3. Abstraktní KavaDecorator a konkrétní MlekoDecorator; 4. Main() kde obalíte espresso do dekorátoru.',
    part1Hint: '1. Rozhraní: public interface IKava { string ZiskejNazev(); int SpocitejCenu(); }',
    part2Hint: '2. Konkrétní produkt: public class Espresso : IKava { ... }',
    part3Hint: '3. Dekorátor: public class MlekoDecorator : IKava { private readonly IKava _kava; ... }',
    part4Hint: '4. Main: IKava kava = new MlekoDecorator(new Espresso());',
    starterCode: `using System;

// 1. ČÁST: Rozhraní
// TODO: public interface IKava


// 2. ČÁST: Konkrétní produkt (Espresso)
// TODO: public class Espresso : IKava


// 3. ČÁST: Dekorátor
// TODO: public class MlekoDecorator : IKava


// 4. ČÁST: Main
public class Program
{
    public static void Main()
    {
        // TODO: IKava mojeKava = new MlekoDecorator(new Espresso());
    }
}`,
    solutionCode: `using System;

// 1. ČÁST: Rozhraní
public interface IKava
{
    string ZiskejNazev();
    int SpocitejCenu();
}

// 2. ČÁST: Konkrétní produkt
public class Espresso : IKava
{
    public string ZiskejNazev() => "Espresso";
    public int SpocitejCenu() => 50;
}

// 3. ČÁST: Dekorátor
public class MlekoDecorator : IKava
{
    private readonly IKava _vnitrni;

    public MlekoDecorator(IKava vnitrni)
    {
        _vnitrni = vnitrni;
    }

    public string ZiskejNazev() => _vnitrni.ZiskejNazev() + " + Mléko";
    public int SpocitejCenu() => _vnitrni.SpocitejCenu() + 15;
}

// 4. ČÁST: Main (vlevo rozhraní, vpravo třída)
public class Program
{
    public static void Main()
    {
        IKava kava = new MlekoDecorator(new Espresso());
        Console.WriteLine($"{kava.ZiskejNazev()} = {kava.SpocitejCenu()} Kč");
    }
}`,
    validationRules: {
      expectedInterfaces: ['IKava'],
      expectedClasses: ['Espresso', 'MlekoDecorator'],
      expectedMainAssignments: [
        { leftType: 'IKava', rightType: 'MlekoDecorator' }
      ]
    }
  },

  {
    id: 'fp-proxy',
    title: 'Vzor Proxy (Ochranný zástupce databáze)',
    patternName: 'Proxy',
    pageReference: 'str. 4 z PDF - Proxy',
    scenario: 'Napište 4 části vzoru Proxy: 1. Společné rozhraní IDatabaze (NactiTajnaData()); 2. Skutečný objekt SkutecnaDatabaze : IDatabaze; 3. DatabazeProxy : IDatabaze držící SkutecnaDatabaze a kontrolující roli Admin; 4. Main() kde vlevo je IDatabaze a vpravo DatabazeProxy.',
    part1Hint: '1. Rozhraní: public interface IDatabaze { string NactiTajnaData(); }',
    part2Hint: '2. Skutečný objekt: public class SkutecnaDatabaze : IDatabaze { ... }',
    part3Hint: '3. Proxy: public class DatabazeProxy : IDatabaze { private SkutecnaDatabaze? _db; private string _role; ... }',
    part4Hint: '4. Main: IDatabaze db = new DatabazeProxy("Admin");',
    starterCode: `using System;

// 1. ČÁST: Společné rozhraní (Subject)
// TODO: public interface IDatabaze


// 2. ČÁST: Skutečný objekt (RealSubject)
// TODO: public class SkutecnaDatabaze : IDatabaze


// 3. ČÁST: Zástupce (Proxy) se stejným rozhraním
// TODO: public class DatabazeProxy : IDatabaze


// 4. ČÁST: Main (vlevo rozhraní, vpravo Proxy)
public class Program
{
    public static void Main()
    {
        // TODO: IDatabaze db = new DatabazeProxy("Admin");
    }
}`,
    solutionCode: `using System;

// 1. ČÁST: Společné rozhraní
public interface IDatabaze
{
    string NactiTajnaData();
}

// 2. ČÁST: Skutečný drahý/citlivý objekt
public class SkutecnaDatabaze : IDatabaze
{
    public string NactiTajnaData() => "Heslo k jadernému kufříku: 1234";
}

// 3. ČÁST: Proxy (stejné rozhraní + kontrola přístupu + lazy init)
public class DatabazeProxy : IDatabaze
{
    private SkutecnaDatabaze? _skutecnaDb;
    private readonly string _role;

    public DatabazeProxy(string role) => _role = role;

    public string NactiTajnaData()
    {
        if (_role != "Admin")
            return "[Proxy] PŘÍSTUP ODEPŘEN!";

        _skutecnaDb ??= new SkutecnaDatabaze();
        return _skutecnaDb.NactiTajnaData();
    }
}

// 4. ČÁST: Main (vlevo rozhraní, vpravo konkrétní třída)
public class Program
{
    public static void Main()
    {
        IDatabaze db = new DatabazeProxy("Admin");
        Console.WriteLine(db.NactiTajnaData());
    }
}`,
    validationRules: {
      expectedInterfaces: ['IDatabaze'],
      expectedClasses: ['SkutecnaDatabaze', 'DatabazeProxy'],
      expectedMainAssignments: [
        { leftType: 'IDatabaze', rightType: 'DatabazeProxy' }
      ]
    }
  },

  {
    id: 'fp-factory-method',
    title: 'Vzor Factory Method (Generátor nepřátel)',
    patternName: 'Factory Method',
    pageReference: 'str. 9–10 z PDF - Tovární metoda',
    scenario: 'Napište 4 části Factory Method: 1. Rozhraní produktu INepritel (Zautoc()); 2. Konkrétní produkt Kostlivec : INepritel; 3. Abstraktní tvůrce GeneratorNepratel s abstract VytvorNepritele() a potomka GeneratorProLes; 4. Main() kde vlevo je GeneratorNepratel a vpravo GeneratorProLes.',
    part1Hint: '1. Rozhraní produktu: public interface INepritel { void Zautoc(); }',
    part2Hint: '2. Konkrétní produkt: public class Kostlivec : INepritel { public void Zautoc() => ... }',
    part3Hint: '3. Tvůrce: public abstract class GeneratorNepratel { public abstract INepritel VytvorNepritele(); } + GeneratorProLes',
    part4Hint: '4. Main: GeneratorNepratel gen = new GeneratorProLes(); INepritel n = gen.VytvorNepritele();',
    starterCode: `using System;

// 1. ČÁST: Rozhraní produktu
// TODO: public interface INepritel


// 2. ČÁST: Konkrétní produkt
// TODO: public class Kostlivec : INepritel


// 3. ČÁST: Abstraktní tvůrce + konkrétní tvůrce (Factory Method)
// TODO: public abstract class GeneratorNepratel a public class GeneratorProLes : GeneratorNepratel


// 4. ČÁST: Main
public class Program
{
    public static void Main()
    {
        // TODO: GeneratorNepratel gen = new GeneratorProLes();
    }
}`,
    solutionCode: `using System;

// 1. ČÁST: Rozhraní produktu
public interface INepritel
{
    void Zautoc();
}

// 2. ČÁST: Konkrétní produkt
public class Kostlivec : INepritel
{
    public void Zautoc() => Console.WriteLine("Kostlivec útočí šípem!");
}

// 3. ČÁST: Tvůrce s tovární metodou
public abstract class GeneratorNepratel
{
    public abstract INepritel VytvorNepritele();
}

public class GeneratorProLes : GeneratorNepratel
{
    public override INepritel VytvorNepritele() => new Kostlivec();
}

// 4. ČÁST: Main (vlevo abstraktní třída/rozhraní, vpravo konkrétní třída)
public class Program
{
    public static void Main()
    {
        GeneratorNepratel gen = new GeneratorProLes();
        INepritel nepritel = gen.VytvorNepritele();
        nepritel.Zautoc();
    }
}`,
    validationRules: {
      expectedInterfaces: ['INepritel'],
      expectedClasses: ['Kostlivec', 'GeneratorNepratel', 'GeneratorProLes'],
      expectedMainAssignments: [
        { leftType: 'GeneratorNepratel', rightType: 'GeneratorProLes' }
      ]
    }
  },

  {
    id: 'fp-observer',
    title: 'Vzor Observer (Hrdina a Odběratelé)',
    patternName: 'Observer',
    pageReference: 'str. 11 & 15 z PDF - Pozorovatel',
    scenario: 'Napište 4 části vzoru Observer: 1. Rozhraní IObserver (Update(int hp)); 2. Konkrétní odběratel StatistikyObserver : IObserver; 3. Subject Hrdina se seznamem List<IObserver> a metodou ZmenZdravi(int hp); 4. Main() kde přihlásíte IObserver k hrdinovi.',
    part1Hint: '1. Rozhraní: public interface IObserver { void Update(int hp); }',
    part2Hint: '2. Konkrétní odběratel: public class StatistikyObserver : IObserver { ... }',
    part3Hint: '3. Subject: public class Hrdina { private List<IObserver> _odberatele = new(); ... }',
    part4Hint: '4. Main: IObserver obs = new StatistikyObserver(); hrdina.Prihlas(obs);',
    starterCode: `using System;
using System.Collections.Generic;

// 1. ČÁST: Rozhraní odběratele
// TODO: public interface IObserver


// 2. ČÁST: Konkrétní odběratel
// TODO: public class StatistikyObserver : IObserver


// 3. ČÁST: Vydavatel (Subject) držící List<IObserver>
// TODO: public class Hrdina


// 4. ČÁST: Main
public class Program
{
    public static void Main()
    {
        // TODO: IObserver obs = new StatistikyObserver();
    }
}`,
    solutionCode: `using System;
using System.Collections.Generic;

// 1. ČÁST: Rozhraní odběratele
public interface IObserver
{
    void Update(int noveHp);
}

// 2. ČÁST: Konkrétní odběratel
public class StatistikyObserver : IObserver
{
    public void Update(int noveHp) => Console.WriteLine($"[Statistiky] Nové HP hrdiny: {noveHp}");
}

// 3. ČÁST: Vydavatel (Subject)
public class Hrdina
{
    private readonly List<IObserver> _odberatele = new List<IObserver>();

    public void Prihlas(IObserver obs) => _odberatele.Add(obs);

    public void ZmenZdravi(int hp)
    {
        foreach (var o in _odberatele)
            o.Update(hp);
    }
}

// 4. ČÁST: Main (vlevo rozhraní, vpravo konkrétní třída)
public class Program
{
    public static void Main()
    {
        IObserver obs = new StatistikyObserver();
        Hrdina h = new Hrdina();
        h.Prihlas(obs);
        h.ZmenZdravi(75);
    }
}`,
    validationRules: {
      expectedInterfaces: ['IObserver'],
      expectedClasses: ['StatistikyObserver', 'Hrdina'],
      expectedMainAssignments: [
        { leftType: 'IObserver', rightType: 'StatistikyObserver' }
      ]
    }
  }
];
