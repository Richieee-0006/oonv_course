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
  }
];
