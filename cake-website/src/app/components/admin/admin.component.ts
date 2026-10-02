import {Component, computed, inject, signal} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Product} from '../models/product';
import {StoreSettings} from '../models/storeSettings';
import {Order} from '../models/order';

@Component({
  selector: 'app-admin',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  private fb = inject(FormBuilder);

  currentMode = signal<'storefront' | 'admin'>('storefront');
  activePage = signal<'home' | 'products' | 'contact'>('home');
  adminTab = signal<'dashboard' | 'orders' | 'products' | 'settings'>('dashboard');

  mobileMenuOpen = signal<boolean>(false);
  orderSubmittedSuccess = signal<boolean>(false);

  // Store Settings State
  settings = signal<StoreSettings>({
    storeName: 'olali.cakes',
    city: 'Gent',
    address: 'Veldstraat / Gent Centrum',
    phone: '+32 480 00 00 00',
    whatsappNumber: '32480000000',
    email: 'info@olalicakes.be',
    minAdvanceHours: 48,
    openingHours: 'Dinsdag - Zondag: 09:00 - 19:00',
    isAcceptingOrders: true
  });

  products = signal<Product[]>([
    {
      id: 1,
      name: 'Luxe Pistache & Frambozentaart',
      category: 'cakes',
      price: 45,
      prepTime: '48 uur',
      badge: 'Bestseller',
      inStock: true,
      image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
      description: 'Luchtige biscuitlagen gevuld met 100% pure pistachecrème en verse rode frambozen.',
      longDescription: 'Onze absolute bestseller in Gent. Gemaakt met pure pistachecrème, fluweelzachte biscuit en een frisse frambozenvulling.',
      creams: ['Pure Pistachecrème', 'Klassieke Vanillecrème', 'Witte Chocoladecrème']
    },
    {
      id: 2,
      name: 'Belgische Chocolade & Karamel Taart',
      category: 'cakes',
      price: 40,
      prepTime: '24 uur',
      inStock: true,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
      description: 'Rijke Belgische chocolade taart met lagen gezouten karamel en chocoladeganache.',
      longDescription: 'Bereid met echte Belgische chocolade, gezouten karamel en een romige ganache afwerking.',
      creams: ['Puur Chocoladecrème', 'Melkchocoladecrème', 'Speculoos / Lotus Crème']
    },
    {
      id: 3,
      name: 'Mini Sweets & Cupcake Assortiment',
      category: 'mini-sweets',
      price: 30,
      prepTime: '24 uur',
      badge: 'Populair',
      inStock: true,
      image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
      description: 'Luxe doos van 12 delicate mini desserts afgewerkt met eetbaar goud en bloemen.',
      longDescription: 'Ideaal voor feesten en recepties in Gent. Gevarieerd assortiment van 12 mini cupcakes en taartjes.',
      creams: ['Pistache', 'Speculoos', 'Vanille', 'Chocolade']
    }
  ]);

  orders = signal<Order[]>([
    {
      id: '101',
      customerName: 'Sophie Van de Velde',
      phone: '+32 471 23 45 67',
      pickupDate: '2026-10-02',
      pickupTime: '14:00',
      productName: 'Luxe Pistache & Frambozentaart',
      creamOption: 'Pure Pistachecrème',
      quantityOrSize: 'Middel (10 pers)',
      totalPrice: 45,
      status: 'Nieuw',
      notes: 'Gouden kaarsjes toevoegen aub',
      createdAt: '2026-09-28'
    },
    {
      id: '102',
      customerName: 'Lucas Janssens',
      phone: '+32 485 99 88 77',
      pickupDate: '2026-10-01',
      pickupTime: '11:30',
      productName: 'Mini Sweets Assortiment',
      creamOption: 'Gemengd (Pistache & Speculoos)',
      quantityOrSize: 'Doos van 12 stuks',
      totalPrice: 30,
      status: 'In behandeling',
      createdAt: '2026-09-27'
    }
  ]);

  customerOrderForm: FormGroup = this.fb.group({
    customerName: ['', Validators.required],
    phone: ['', Validators.required],
    pickupDate: ['', Validators.required],
    pickupTime: ['14:00', Validators.required],
    productName: ['Luxe Pistache & Frambozentaart', Validators.required],
    creamOption: ['Pistachecrème', Validators.required],
    notes: ['']
  });

  productAdminForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    category: ['cakes', Validators.required],
    price: [40, [Validators.required, Validators.min(1)]],
    image: ['https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80', Validators.required],
    creamsInput: ['Pistache, Chocolade, Vanille', Validators.required],
    description: [''],
    inStock: [true]
  });

  // Modal Signals
  selectedProduct = signal<Product | null>(null);
  selectedCreamOption = signal<string>('');
  showProductFormModal = signal<boolean>(false);
  editingProductId = signal<number | null>(null);

  // Computed Properties
  featuredProducts = computed(() => this.products().slice(0, 3));
  totalRevenue = computed(() => this.orders().reduce((acc, order) => acc + order.totalPrice, 0));

  setActivePage(page: 'home' | 'products' | 'contact') {
    this.activePage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  openProductModal(product: Product) {
    this.selectedProduct.set(product);
    this.selectedCreamOption.set(product.creams[0] || 'Pistachecrème');
  }

  closeProductModal() {
    this.selectedProduct.set(null);
  }

  orderProductViaWhatsApp(product: Product) {
    const cream = this.selectedCreamOption() || 'Pistachecrème';
    const msg = encodeURIComponent(
      `Hallo olali.cakes Gent 👋\nIk wil graag bestellen: *${product.name}*\n` +
      `Gekozen Crème: ${cream}\n` +
      `Prijs: €${product.price}`
    );
    window.open(`https://wa.me/${this.settings().whatsappNumber}?text=${msg}`, '_blank');
  }

  submitCustomerOrder() {
    if (this.customerOrderForm.valid) {
      const val = this.customerOrderForm.value;
      const matchedProduct = this.products().find(p => p.name === val.productName);

      const newOrder: Order = {
        id: Math.floor(100 + Math.random() * 900).toString(),
        customerName: val.customerName,
        phone: val.phone,
        pickupDate: val.pickupDate,
        pickupTime: val.pickupTime,
        productName: val.productName,
        creamOption: val.creamOption,
        quantityOrSize: 'Standaard',
        totalPrice: matchedProduct ? matchedProduct.price : 40,
        status: 'Nieuw',
        notes: val.notes,
        createdAt: new Date().toISOString().split('T')[0]
      };

      this.orders.update(prev => [newOrder, ...prev]);
      this.orderSubmittedSuccess.set(true);
      this.customerOrderForm.reset();
    }
  }

  updateOrderStatus(orderId: string, event: Event) {
    const selectElem = event.target as HTMLSelectElement;
    const newStatus = selectElem.value as Order['status'];

    this.orders.update(list =>
      list.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
    );
  }

  sendWhatsAppStatus(order: Order) {
    const text = encodeURIComponent(
      `Beste ${order.customerName},\n\nUpdate over je bestelling bij olali.cakes Gent (#${order.id}):\n` +
      `Status: *${order.status}*\n` +
      `Product: ${order.productName} (${order.creamOption})\n` +
      `Afhaaldatum: ${order.pickupDate} om ${order.pickupTime} uur.\n\n` +
      `Bedankt!`
    );
    window.open(`https://wa.me/${order.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  }

  openProductFormModal(product?: Product) {
    if (product) {
      this.editingProductId.set(product.id);
      this.productAdminForm.patchValue({
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.image,
        creamsInput: product.creams.join(', '),
        description: product.description,
        inStock: product.inStock
      });
    } else {
      this.editingProductId.set(null);
      this.productAdminForm.reset({
        category: 'cakes',
        price: 40,
        image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
        creamsInput: 'Pistache, Chocolade, Speculoos',
        inStock: true
      });
    }
    this.showProductFormModal.set(true);
  }

  closeProductFormModal() {
    this.showProductFormModal.set(false);
  }

  saveAdminProduct() {
    if (this.productAdminForm.valid) {
      const val = this.productAdminForm.value;
      const creamsList = val.creamsInput.split(',').map((c: string) => c.trim()).filter((c: string) => c.length > 0);

      if (this.editingProductId()) {
        this.products.update(list => list.map(p => p.id === this.editingProductId() ? {
          ...p,
          name: val.name,
          category: val.category,
          price: val.price,
          image: val.image,
          creams: creamsList,
          description: val.description,
          inStock: val.inStock
        } : p));
      } else {
        const newProd: Product = {
          id: Date.now(),
          name: val.name,
          category: val.category,
          price: val.price,
          prepTime: '24 uur',
          inStock: val.inStock,
          image: val.image,
          description: val.description || 'Ambachtelijke creatie',
          longDescription: val.description || 'Ambachtelijke creatie bereid in Gent.',
          creams: creamsList
        };
        this.products.update(prev => [...prev, newProd]);
      }
      this.closeProductFormModal();
    }
  }

  deleteProduct(productId: number) {
    this.products.update(list => list.filter(p => p.id !== productId));
  }

  updateSettingField(field: keyof StoreSettings, event: Event) {
    const input = event.target as HTMLInputElement;
    this.settings.update(s => ({ ...s, [field]: input.value }));
  }
}
