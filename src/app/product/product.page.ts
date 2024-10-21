import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { register } from 'swiper/element/bundle';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { GlobalService } from '../services/global.service';

register();

interface Product {
  image: string;
  description: string;
  discount: string;
  oldPrice: string;
  newPrice: string;
}

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit, OnDestroy {

  product: any; // Holds the selected product
  img1: string | null = null;
  newPrice: string | null = null;
  discount: string | null = null;
  text1: string | null = null;
  oldPrice: string | null = null;

  selectedColorIndex: number | null = null;
  selectedSizeIndex: number | null = null;

  // Color and size options
  colorOptions: string[] = [];
  sizeOptions: string[] = [];
  selectedSlides: boolean[] = [];

  isFavorite: boolean = false;
  quantity: number = 1;
  minutes: number = 0;
  seconds: number = 0;

  // Subscriptions
  private timerSubscription: Subscription | undefined;
  private queryParamsSubscription: Subscription | undefined;

  constructor(
    private router: Router,
    private dataService: DataService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.startTimer();
    
    // Load color and size options from data service
    this.colorOptions = this.dataService.getColorOptions();
    this.sizeOptions = this.dataService.getSizeOptions();
    this.selectedSlides = new Array(this.colorOptions.length).fill(false);

    // Retrieve product data from query parameters
    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      console.log(params); // Log incoming parameters to debug
      
      // Set product details from query parameters
      this.img1 = params['image'];
      this.text1 = params['description'];
      this.discount = params['discount'];
      this.oldPrice = params['oldPrice'];
      this.newPrice = params['newPrice'];

      // Handle missing parameters (logging for now)
      if (!this.img1 || !this.text1 || !this.discount || !this.oldPrice || !this.newPrice) {
        console.error('Some query parameters are missing');
      }
    });
  }

  ngOnDestroy() {
    this.stopTimer();
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
  }

  // Toggle favorite status
  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  // Increment product quantity
  increment() {
    this.quantity++;
  }

  // Decrement product quantity
  decrement() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // Start a timer for demonstration purposes
  startTimer() {
    this.timerSubscription = interval(1000).subscribe(() => {
      this.seconds++;
      if (this.seconds === 60) {
        this.seconds = 0;
        this.minutes++;
      }
    });
  }

  // Stop the timer when the component is destroyed
  stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = undefined;
    }
  }

  // Method to select a color
  selectColor(index: number) {
    this.selectedColorIndex = index;
    console.log("Selected Color Index: ", index);
    console.log("Selected Color: ", this.colorOptions[index]);
  }

  // Method to select a size
  selectSize(index: number) {
    this.selectedSizeIndex = index;
    console.log("Selected Size Index: ", index);
    console.log("Selected Size: ", this.sizeOptions[index]);
  }

  // Toggle slide selection for demonstration purposes
  toggleSlideSelection(index: number) {
    this.selectedSlides[index] = !this.selectedSlides[index];
  }

  // Navigate to another page with product details
  goToNextPage(product: Product) {
    this.router.navigate(['/cart'], {
      queryParams: {
        image: product.image,
        description: product.description,
        discount: product.discount,
        oldPrice: product.oldPrice,
        newPrice: product.newPrice
      }
    });
  }
}
