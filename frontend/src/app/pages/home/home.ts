import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('scene') sceneRef!: ElementRef<HTMLElement>;

  ngAfterViewInit() {
    const scene = this.sceneRef.nativeElement;
    const colors = ['#f9a8d4','#fbcfe8','#fce7f3','#f472b6','#e879f9','#d8b4fe','#fda4af'];

    for (let i = 0; i < 22; i++) {
      const p = document.createElement('div');
      p.className = 'petal';
      const size = 5 + Math.random() * 11;
      const br1  = 40 + Math.random() * 30;
      const br2  = 20 + Math.random() * 30;
      p.style.cssText = `
        width:${size}px;height:${size}px;
        left:${Math.random() * 100}%;
        top:${Math.random() * -5}%;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        animation-duration:${6 + Math.random() * 9}s;
        animation-delay:${Math.random() * 10}s;
        border-radius:${br1}% ${br2}% ${br1}% ${br2}%;
        opacity:0;
      `;
      scene.appendChild(p);
    }
  }
}
