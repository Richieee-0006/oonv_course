import { SandboxTemplate } from '../types/trainer';

export const sandboxTemplates: SandboxTemplate[] = [
  {
    id: 'template-payments',
    name: 'Šablona 1: Chytrý systém pro zpracování plateb (Zápočtový projekt)',
    patternsUsed: ['Strategy', 'Adapter', 'Proxy'],
    description: 'Komplexní platební brána splňující požadavek zápočtového projektu na kombinaci 3 vzorů GoF. Nákupní košík používá Strategy pro volbu platby, Adapter integruje Bitcoin/PayPal API a Bezpečnostní Proxy provádí autorizační kontrolu a limitní filtry.',
    architectureHighlights: [
      'Strategy: IPlatebniBrana tvoří páteřní kontrakt pro různé způsoby úhrady.',
      'Adapter: CryptoAdapter obaluje cizí BitcoinRpcClient a provádí konverzi měny.',
      'Proxy: BezpecnostniPlatebniProxy obaluje libovolnou bránu, blokuje transakce nad 100 000 Kč a loguje auditní stopu.'
    ],
    initialCode: `using System;

// =========================================================================
// 1. ZÁKLADNÍ KONTRAKT (Rozhraní strategie)
// =========================================================================
public interface IPlatebniBrana
{
    string Nazev { get; }
    bool ZpracujPlatbu(decimal castkaKc, string idZakaznika);
}

// =========================================================================
// 2. STRATEGY: Konkrétní standardní strategie
// =========================================================================
public class PlatbaKartouStrategie : IPlatebniBrana
{
    public string Nazev => "Platební karta (Mastercard/Visa)";

    public bool ZpracujPlatbu(decimal castkaKc, string idZakaznika)
    {
        Console.WriteLine($"[Karta] Stržena částka {castkaKc:N2} Kč pro zákazníka {idZakaznika}.");
        return true;
    }
}

// =========================================================================
// 3. ADAPTER: Propojení nekompatibilní externí krypto knihovny
// =========================================================================
// Cizí knihovna (Adaptee)
public class ExternalBitcoinNetworkClient
{
    public string BroadcastSatoshisTransaction(string walletAddress, long satoshis)
    {
        return $"TXID_BTC_{Guid.NewGuid().ToString().Substring(0, 8)}: Posláno {satoshis} satoshi do peněženky {walletAddress}";
    }
}

// Samotný Adaptér
public class BitcoinPlatebniAdapter : IPlatebniBrana
{
    private readonly ExternalBitcoinNetworkClient _btcNetwork;
    private readonly string _merchantWallet;
    private const decimal KurzBtcKc = 1_500_000m; // 1 BTC = 1.5 mil Kč

    public string Nazev => "Bitcoin Lightning / On-chain";

    public BitcoinPlatebniAdapter(ExternalBitcoinNetworkClient btcNetwork, string merchantWallet)
    {
        _btcNetwork = btcNetwork;
        _merchantWallet = merchantWallet;
    }

    public bool ZpracujPlatbu(decimal castkaKc, string idZakaznika)
    {
        decimal btcAmount = castkaKc / KurzBtcKc;
        long satoshis = (long)(btcAmount * 100_000_000m);

        Console.WriteLine($"[CryptoAdapter] Převod {castkaKc:N2} Kč -> {btcAmount:F6} BTC ({satoshis} satoshi)...");
        string txInfo = _btcNetwork.BroadcastSatoshisTransaction(_merchantWallet, satoshis);
        Console.WriteLine($"[CryptoAdapter] Síť potvrdila: {txInfo}");
        return true;
    }
}

// =========================================================================
// 4. PROXY: Bezpečnostní a auditní zástupce (Protection & Logging Proxy)
// =========================================================================
public class BezpecnostniPlatebniProxy : IPlatebniBrana
{
    private readonly IPlatebniBrana _skutecnaBrana;
    private readonly decimal _maximalniLimitTransakce;

    public string Nazev => $"Zabezpečená {_skutecnaBrana.Nazev} (Limit: {_maximalniLimitTransakce:N0} Kč)";

    public BezpecnostniPlatebniProxy(IPlatebniBrana skutecnaBrana, decimal limitKc = 50_000m)
    {
        _skutecnaBrana = skutecnaBrana;
        _maximalniLimitTransakce = limitKc;
    }

    public bool ZpracujPlatbu(decimal castkaKc, string idZakaznika)
    {
        Console.WriteLine($"[Audit Proxy] Zahájena kontrola transakce pro '{idZakaznika}', částka: {castkaKc:N2} Kč.");

        // Bezpečnostní limit
        if (castkaKc > _maximalniLimitTransakce)
        {
            Console.WriteLine($"[Audit Proxy] ⛔ ZAMÍTNUTO! Částka {castkaKc:N2} Kč překračuje povolený limit {_maximalniLimitTransakce:N2} Kč.");
            return false;
        }

        if (string.IsNullOrWhiteSpace(idZakaznika))
        {
            Console.WriteLine("[Audit Proxy] ⛔ ZAMÍTNUTO! Identifikátor zákazníka nesmí být prázdný.");
            return false;
        }

        Console.WriteLine("[Audit Proxy] ✅ Bezpečnostní prověrka úspěšná. Předávám platbu reálné bráně...");
        bool vysledek = _skutecnaBrana.ZpracujPlatbu(castkaKc, idZakaznika);

        Console.WriteLine($"[Audit Proxy] Transakce dokončena se statusem: {(vysledek ? "ÚSPĚCH" : "CHYBA")}.");
        return vysledek;
    }
}

// =========================================================================
// 5. KONTEXT: Nákupní košík (Používá Strategy)
// =========================================================================
public class NakupniKosik
{
    private IPlatebniBrana? _brana;

    public void ZvolitPlatebniMetodu(IPlatebniBrana brana)
    {
        _brana = brana;
        Console.WriteLine($"[Košík] Nastavena nová metoda: {_brana.Nazev}");
    }

    public void ZaplatitObjednavku(decimal castka, string zakaznik)
    {
        if (_brana == null)
        {
            Console.WriteLine("[Košík] ❌ CHYBA: Nebyla zvolena žádná platební metoda!");
            return;
        }

        Console.WriteLine($"\\n--- Zpracování objednávky v košíku ({castka:N2} Kč) ---");
        bool uspech = _brana.ZpracujPlatbu(castka, zakaznik);
        Console.WriteLine($"Výsledek objednávky: {(uspech ? "DOKONČENO" : "ZAMÍTNUTO")}");
    }
}

// =========================================================================
// 6. SPUŠTĚNÍ CELÉHO SYSTÉMU V MAIN
// =========================================================================
public class Program
{
    public static void Main()
    {
        Console.WriteLine("==================================================================");
        Console.WriteLine("   ZÁPOČTOVÝ PROJEKT: CHYTRÝ SYSTÉM PRO ZPRACOVÁNÍ PLATEB");
        Console.WriteLine("   Vzory: Strategy + Adapter + Proxy");
        Console.WriteLine("==================================================================\\n");

        NakupniKosik kosik = new NakupniKosik();

        // 1. Zkouška: Běžná karta s proxy ochranou (Limit 20 000 Kč)
        IPlatebniBrana zabezpecenaKarta = new BezpecnostniPlatebniProxy(
            new PlatbaKartouStrategie(), 
            limitKc: 20_000m
        );
        kosik.ZvolitPlatebniMetodu(zabezpecenaKarta);
        kosik.ZaplatitObjednavku(4_500m, "zakaznik_karel");

        // 2. Zkouška: Překročení limitu na kartě
        kosik.ZaplatitObjednavku(25_000m, "zakaznik_karel");

        // 3. Zkouška: Přepnutí na Bitcoin adaptér obalený v bezpečnostní proxy
        ExternalBitcoinNetworkClient btcNode = new ExternalBitcoinNetworkClient();
        IPlatebniBrana kryptoAdapter = new BitcoinPlatebniAdapter(btcNode, "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh");
        
        IPlatebniBrana zabezpeceneKrypto = new BezpecnostniPlatebniProxy(kryptoAdapter, limitKc: 100_000m);
        kosik.ZvolitPlatebniMetodu(zabezpeceneKrypto);
        kosik.ZaplatitObjednavku(60_000m, "zakaznik_elona");
    }
}`
  },

  {
    id: 'template-rpg-editor',
    name: 'Šablona 2: RPG Hra & Příkazový systém (Zápočtový projekt)',
    patternsUsed: ['Command', 'Memento', 'Observer', 'Decorator'],
    description: 'Robustní herní a příkazový engine propojující 4 klíčové návrhové vzory. Zahrnuje vratné příkazy s historií Undo (Command), stavové snímky hrdiny (Memento), notifikaci o herních událostech (Observer) a dynamické magické očarování zbraní (Decorator).',
    architectureHighlights: [
      'Command: IPrikaz s Execute() a Undo() řídí tahy v bitvě.',
      'Memento: HracMemento ukládá HP a manu do časové schránky.',
      'Observer: IHerniObserver informuje herní log a zvukový systém o každé události.',
      'Decorator: ZbranDecorator obaluje zbraň o magické poškození (Oheň, Blesk).'
    ],
    initialCode: `using System;
using System.Collections.Generic;

// =========================================================================
// 1. DECORATOR: Zbraně a jejich očarování (Kombinace vrstev)
// =========================================================================
public interface IZbran
{
    string ZiskejNazev();
    int VypocitejPoskozeni();
}

public class ObycejnyMec : IZbran
{
    public string ZiskejNazev() => "Železný meč";
    public int VypocitejPoskozeni() => 20;
}

public abstract class ZbranDecorator : IZbran
{
    protected readonly IZbran _vnitrniZbran;

    public ZbranDecorator(IZbran zbran) => _vnitrniZbran = zbran;
    public virtual string ZiskejNazev() => _vnitrniZbran.ZiskejNazev();
    public virtual int VypocitejPoskozeni() => _vnitrniZbran.VypocitejPoskozeni();
}

public class OhnivyDecorator : ZbranDecorator
{
    public OhnivyDecorator(IZbran zbran) : base(zbran) {}
    public override string ZiskejNazev() => _vnitrniZbran.ZiskejNazev() + " + Plameny";
    public override int VypocitejPoskozeni() => _vnitrniZbran.VypocitejPoskozeni() + 15;
}

public class BleskovyDecorator : ZbranDecorator
{
    public BleskovyDecorator(IZbran zbran) : base(zbran) {}
    public override string ZiskejNazev() => _vnitrniZbran.ZiskejNazev() + " + Bleskový výboj";
    public override int VypocitejPoskozeni() => _vnitrniZbran.VypocitejPoskozeni() + 25;
}

// =========================================================================
// 2. OBSERVER: Herní události a logger
// =========================================================================
public interface IHerniObserver
{
    void OnUdalost(string zprava);
}

public class HerniKonzoleLogger : IHerniObserver
{
    public void OnUdalost(string zprava) => Console.WriteLine($"  [HERNÍ LOG] {zprava}");
}

// =========================================================================
// 3. MEMENTO: Snímek stavu hrdiny (Časová kapsle)
// =========================================================================
public class HrdinaMemento
{
    public int Zdravi { get; }
    public int Mana { get; }

    public HrdinaMemento(int zdravi, int mana)
    {
        Zdravi = zdravi;
        Mana = mana;
    }
}

// =========================================================================
// HRDINA (Originator + Subject)
// =========================================================================
public class Hrdina
{
    public string Jmeno { get; }
    public int Zdravi { get; private set; } = 100;
    public int Mana { get; private set; } = 50;
    public IZbran Zbran { get; set; } = new ObycejnyMec();

    private readonly List<IHerniObserver> _observers = new();

    public Hrdina(string jmeno) => Jmeno = jmeno;

    public void PridejObserver(IHerniObserver o) => _observers.Add(o);

    private void Notifikuj(string msg)
    {
        foreach (var o in _observers) o.OnUdalost(msg);
    }

    public void UdelejUtok()
    {
        int poskozeni = Zbran.VypocitejPoskozeni();
        Notifikuj($"{Jmeno} zaútočil zbraní '{Zbran.ZiskejNazev()}' za {poskozeni} zranění!");
    }

    public void UtrpZraneni(int dmg)
    {
        Zdravi -= dmg;
        Notifikuj($"{Jmeno} utrpěl {dmg} zranění. Aktuální HP: {Zdravi}/{100}");
    }

    public HrdinaMemento UlozSnapshot() => new HrdinaMemento(Zdravi, Mana);

    public void ObnovSnapshot(HrdinaMemento snapshot)
    {
        Zdravi = snapshot.Zdravi;
        Mana = snapshot.Mana;
        Notifikuj($"{Jmeno} obnovil svůj stav: HP={Zdravi}, Mana={Mana}");
    }
}

// =========================================================================
// 4. COMMAND: Vratné akce s Undo / Redo
// =========================================================================
public interface IPrikaz
{
    void Execute();
    void Undo();
}

public class UtokPrikaz : IPrikaz
{
    private readonly Hrdina _hrdina;
    private readonly HrdinaMemento _predeslyStav;

    public UtokPrikaz(Hrdina hrdina)
    {
        _hrdina = hrdina;
        _predeslyStav = hrdina.UlozSnapshot(); // Memento zapouzdřené uvnitř příkazu!
    }

    public void Execute()
    {
        _hrdina.UdelejUtok();
        _hrdina.UtrpZraneni(10); // Odveta protivníka
    }

    public void Undo()
    {
        Console.WriteLine("[Command Undo] Vracím tah v bitvě zpět v čase...");
        _hrdina.ObnovSnapshot(_predeslyStav);
    }
}

// Invoker s historií
public class BitvaSpravce
{
    private readonly Stack<IPrikaz> _historie = new();

    public void VykonatTah(IPrikaz prikaz)
    {
        prikaz.Execute();
        _historie.Push(prikaz);
    }

    public void KrokZpet()
    {
        if (_historie.Count > 0)
        {
            IPrikaz posledni = _historie.Pop();
            posledni.Undo();
        }
        else
        {
            Console.WriteLine("[Bitva] Nelze jít více do minulosti.");
        }
    }
}

// =========================================================================
// 5. MAIN VÝVOJ
// =========================================================================
public class Program
{
    public static void Main()
    {
        Console.WriteLine("==================================================================");
        Console.WriteLine("   ZÁPOČTOVÝ PROJEKT: RPG ENGINE");
        Console.WriteLine("   Vzory: Command + Memento + Observer + Decorator");
        Console.WriteLine("==================================================================\\n");

        Hrdina geralt = new Hrdina("Geralt z Rivie");
        geralt.PridejObserver(new HerniKonzoleLogger());

        // 1. Očarování zbraně přes Decorator
        Console.WriteLine("1. VYLEPŠOVÁNÍ ZBRANĚ:");
        geralt.Zbran = new BleskovyDecorator(
            new OhnivyDecorator(
                new ObycejnyMec()
            )
        );
        Console.WriteLine($"Geraltova nová zbraň: {geralt.Zbran.ZiskejNazev()} (Dmg: {geralt.Zbran.VypocitejPoskozeni()})\\n");

        // 2. Tahy v bitvě přes Command & Memento
        Console.WriteLine("2. SOUBOJ S BOSSEM:");
        BitvaSpravce bitva = new BitvaSpravce();

        Console.WriteLine("--- Tah 1 ---");
        bitva.VykonatTah(new UtokPrikaz(geralt));

        Console.WriteLine("\\n--- Tah 2 ---");
        bitva.VykonatTah(new UtokPrikaz(geralt));

        // 3. Chyba v taktice -> Undo pomocí Command + Memento
        Console.WriteLine("\\n3. TAH BYL CHYBOU - VRACÍME ZPĚT (UNDO):");
        bitva.KrokZpet();
    }
}`
  }
];
