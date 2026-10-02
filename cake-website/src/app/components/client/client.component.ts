import {Component, computed, inject, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Product} from '../models/product';

@Component({
  selector: 'app-client',
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent {
  title = 'cake-website';
  private fb = inject(FormBuilder);

  activePage = signal<'home' | 'products' | 'contact'>('home');
  mobileMenuOpen = signal<boolean>(false);
  selectedCategory = signal<'all' | 'cakes' | 'mini-sweets'>('all');

  // Modal state
  selectedProduct = signal<Product | null>(null);
  selectedCreamOption = signal<string>('');
  selectedSizeIndex = signal<number>(0);

  // Form State
  formSubmitted = signal<boolean>(false);
  currentYear = new Date().getFullYear();

  contactForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    email: [''],
    eventDate: ['', Validators.required],
    cakeType: [''],
    preferredCream: ['any'],
    notes: ['']
  });

  allProducts = signal<Product[]>([
    {
      id: 1,
      name: 'Luxe Pistache & Frambozentaart',
      category: 'cakes',
      price: 45,
      prepTime: '48 uur',
      badge: 'Populair',
      image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
      description: 'Luchtige biscuitlagen gevuld met 100% pure pistachecrème en verse rode frambozen.',
      longDescription: 'Onze absolute bestseller in Gent. Gemaakt met pure pistachecrème, fluweelzachte biscuit en een frisse frambozenvulling voor een perfect evenwicht tussen zoet en fris.',
      creams: ['Pure Pistachecrème', 'Klassieke Vanillecrème', 'Witte Chocoladecrème'],
      sizes: ['Klein (6-8 pers) - €45', 'Middel (10-12 pers) - €65', 'Groot (15-20 pers) - €90'],
      inStock: true
    },
    {
      id: 2,
      name: 'Belgische Chocolade & Karamel Taart',
      category: 'cakes',
      price: 40,
      prepTime: '24 uur',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
      description: 'Rijke Belgische chocolade taart met lagen gezouten karamel en chocoladeganache.',
      longDescription: 'Een droom voor chocoladeliefhebbers. Bereid met echte Belgische chocolade, gezouten karamel en een romige ganache afwerking.',
      creams: ['Puure Chocoladecrème', 'Melkchocoladecrème', 'Speculoos / Lotus Crème'],
      sizes: ['Klein (6-8 pers) - €40', 'Middel (10-12 pers) - €60', 'Groot (16 pers) - €85'],
      inStock: true
    },
    {
      id: 3,
      name: 'Mini Sweets & Cupcake Assortiment',
      category: 'mini-sweets',
      price: 30,
      prepTime: '24 uur',
      badge: 'Nieuw',
      image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
      description: 'Luxe doos van 12 delicate mini desserts afgewerkt met eetbaar goud en bloemen.',
      longDescription: 'Ideaal voor feesten en recepties in Gent. Een gevarieerd assortiment van 12 mini cupcakes en taartjes, prachtig gepresenteerd.',
      creams: ['Gemengd (Pistache, Speculoos, Vanille)', 'Tropische Fruitcrème', 'Chocoladecrème'],
      sizes: ['Doos van 12 stuks - €30', 'Doos van 24 stuks - €55'],
      inStock: true
    },
    {
      id: 4,
      name: 'Speculoos & Vanille Taart',
      category: 'cakes',
      price: 38,
      prepTime: '24 uur',
      image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
      description: 'Klassieke Belgische speculoossmaak gecombineerd met een luchtige vanillecrème.',
      longDescription: 'Heerlijk authentiek. Luchtige lagen taart overgoten met speculoos pasta en opgeklopte vanillecrème.',
      creams: ['Speculoos / Lotus Crème', 'Vanille-Melk Crème', 'Witte Chocoladecrème'],
      sizes: ['Klein (6 pers) - €38', 'Middel (10 pers) - €55'],
      inStock: true
    },
    {
      id: 5,
      name: 'Mini Fruit Tartelettes Box',
      category: 'mini-sweets',
      price: 28,
      prepTime: '24 uur',
      image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80',
      description: 'Krokante tartelettes gevuld met vanille crème patissière en vers seizoensfruit.',
      longDescription: 'Licht en verfrissend. Ambachtelijk gebakken deegbodems gevuld met romige vanillecrème en belegd met frambozen, mango en blauwe bessen.',
      creams: ['Crème Pattissière Vanille', 'Frisse Citroen-Melk Crème'],
      sizes: ['Doos van 10 stuks - €28', 'Doos van 20 stuks - €50'],
      inStock: true
    },
    {
      id: 6,
      name: 'Custom Thema Verjaardagstaart',
      category: 'cakes',
      price: 55,
      prepTime: '72 uur',
      badge: 'Op Maat',
      image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=800&q=80',
      description: 'Gepersonaliseerd ontwerp volgens jouw thema, kleuren en specifieke wensen.',
      longDescription: 'Laat je droomtaart realiseren! Kies het gewenste thema, de kleuren, decoratie en smaken voor jouw verjaardag of jubileum.',
      creams: ['Pistachecrème', 'Chocoladecrème', 'Vanillecrème', 'Fruitcrème'],
      sizes: ['1 Laag - €55', '2 Lagen - €110', '3 Lagen - €170'],
      inStock: true
    }
  ]);

  featuredProducts = computed(() => this.allProducts().slice(0, 3));

  filteredProducts = computed(() => {
    const cat = this.selectedCategory();
    if (cat === 'all') return this.allProducts();
    return this.allProducts().filter(p => p.category === cat);
  });

  modalCalculatedPrice = computed(() => {
    const prod = this.selectedProduct();
    if (!prod) return 0;

    const basePrice = prod.price;
    const sizeIndex = this.selectedSizeIndex();
    return basePrice + (sizeIndex * 20);
  });

  setActivePage(page: 'home' | 'products' | 'contact') {
    this.activePage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  openProductModal(product: Product) {
    this.selectedProduct.set(product);
    this.selectedCreamOption.set(product.creams[0] || '');
    this.selectedSizeIndex.set(0);
  }

  closeProductModal() {
    this.selectedProduct.set(null);
  }

  orderProductViaWhatsApp(product: Product) {
    const cream = this.selectedCreamOption() || 'In overleg';
    const text = encodeURIComponent(
      `Hallo olali.cakes 👋\nIk wil graag bestellen/vragen over: *${product.name}*\n` +
      `Gekozen Crème: ${cream}\n` +
      `Richtprijs: €${this.modalCalculatedPrice()}\n` +
      `Stad: Gent`
    );
    window.open(`https://wa.me/32480000000?text=${text}`, '_blank');
  }

  submitForm() {
    if (this.contactForm.valid) {
      this.formSubmitted.set(true);
      this.contactForm.reset();
    }
  }
}
