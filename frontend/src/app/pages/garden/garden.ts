import { ChangeDetectorRef, Component, HostListener, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GardenService } from '../../core/services/garden';

// ── TIPOS ──
export interface PlantedFlower {
  id: number;
  type: 'rosa' | 'girassol' | 'tulipa';
  x: number;
  y: number;
  titulo: string;
  mensagem: string;
  imageURL: string | null;
}

// ── IMAGENS SVG ──
const ROSA     = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 90"><rect x="27" y="50" width="6" height="40" rx="3" fill="#2d7a3a"/><ellipse cx="30" cy="32" rx="22" ry="28" fill="#b01250"/><ellipse cx="30" cy="32" rx="18" ry="24" fill="#c8185e"/><ellipse cx="20" cy="28" rx="10" ry="14" fill="#d4206a" opacity="0.8"/><ellipse cx="40" cy="28" rx="10" ry="14" fill="#d4206a" opacity="0.8"/><ellipse cx="30" cy="20" rx="8" ry="10" fill="#a01048"/><ellipse cx="30" cy="22" rx="6" ry="8" fill="#e02878"/></svg>')}`;
const GIRASSOL = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 90"><rect x="27" y="36" width="6" height="54" rx="3" fill="#2d7a3a"/><ellipse cx="30" cy="8" rx="5" ry="11" fill="#fbbf24"/><ellipse cx="42.7" cy="11.3" rx="5" ry="11" fill="#fbbf24" transform="rotate(45 42.7 11.3)"/><ellipse cx="48" cy="26" rx="5" ry="11" fill="#fbbf24" transform="rotate(90 48 26)"/><ellipse cx="42.7" cy="40.7" rx="5" ry="11" fill="#fbbf24" transform="rotate(135 42.7 40.7)"/><ellipse cx="30" cy="44" rx="5" ry="11" fill="#fbbf24" transform="rotate(180 30 44)"/><ellipse cx="17.3" cy="40.7" rx="5" ry="11" fill="#fbbf24" transform="rotate(225 17.3 40.7)"/><ellipse cx="12" cy="26" rx="5" ry="11" fill="#fbbf24" transform="rotate(270 12 26)"/><ellipse cx="17.3" cy="11.3" rx="5" ry="11" fill="#fbbf24" transform="rotate(315 17.3 11.3)"/><circle cx="30" cy="26" r="12" fill="#78350f"/><circle cx="30" cy="26" r="9" fill="#92400e"/></svg>')}`;
const TULIPA   = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 90"><rect x="27" y="44" width="6" height="46" rx="3" fill="#2d7a3a"/><rect x="14" y="58" width="4" height="18" rx="2" fill="#3d8a4e" transform="rotate(-20 16 58)"/><rect x="42" y="58" width="4" height="18" rx="2" fill="#3d8a4e" transform="rotate(20 44 58)"/><path d="M30 8 C22 8 16 16 16 28 C16 38 22 46 30 46 C38 46 44 38 44 28 C44 16 38 8 30 8Z" fill="#ff4d8d"/><path d="M30 8 C24 12 20 20 20 28 C20 38 24 44 30 46 C30 46 30 8 30 8Z" fill="#ff6ba0" opacity="0.7"/><path d="M30 8 C36 12 40 20 40 28 C40 38 36 44 30 46 C30 46 30 8 30 8Z" fill="#e0306e" opacity="0.6"/></svg>')}`;

export const FLOWERS: { [key in 'rosa' | 'girassol' | 'tulipa']: { name: string; img: string } } = {
  rosa:     { name: 'Rosa',     img: ROSA },
  girassol: { name: 'Girassol', img: GIRASSOL },
  tulipa:   { name: 'Tulipa',   img: TULIPA },
};

// ── PLANTAS NOTURNAS ──
const NIGHT_ROSA = `data:image/svg+xml,${encodeURIComponent('<svg viewBox="0 0 220 520" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="40" r="1.5" fill="#7eb8ff" opacity="0.8"/><circle cx="150" cy="70" r="2" fill="#7eb8ff" opacity="0.6"/><circle cx="190" cy="140" r="1.5" fill="#7eb8ff" opacity="0.5"/><circle cx="20" cy="200" r="1" fill="#7eb8ff" opacity="0.7"/><circle cx="200" cy="280" r="2" fill="#7eb8ff" opacity="0.5"/><circle cx="80" cy="420" r="1.5" fill="#7eb8ff" opacity="0.4"/><path d="M50,90 L52,96 L58,98 L52,100 L50,106 L48,100 L42,98 L48,96 Z" fill="#7eb8ff" opacity="0.7"/><path d="M170,180 L171,184 L175,185 L171,186 L170,190 L169,186 L165,185 L169,184 Z" fill="#7eb8ff" opacity="0.5"/><path d="M110 490 Q108 430 106 380 Q108 330 110 270" stroke="#156030" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M110 490 Q80 450 65 400 Q80 408 100 445 Z" fill="#1b7a3a"/><path d="M110 490 Q140 450 155 400 Q140 408 120 445 Z" fill="#156030"/><path d="M110 490 Q78 410 80 365 Q95 382 105 440 Z" fill="#1b7a3a"/><path d="M110 490 Q142 410 140 365 Q125 382 115 440 Z" fill="#156030"/><path d="M110 270 Q128 218 158 200 Q148 245 123 268 Z" fill="#5a3e8a"/><path d="M110 270 Q148 248 168 228 Q153 268 123 275 Z" fill="#4a2d7a"/><path d="M110 270 Q88 208 78 178 Q98 200 113 248 Z" fill="#c0b0e8"/><path d="M110 270 Q63 238 43 228 Q63 263 103 278 Z" fill="#b0a0d8"/><ellipse cx="108" cy="268" rx="18" ry="22" fill="#e8e8f8"/><ellipse cx="108" cy="266" rx="12" ry="15" fill="#f5f0ff"/><line x1="103" y1="255" x2="98" y2="235" stroke="#a080d0" stroke-width="1.5"/><line x1="108" y1="253" x2="108" y2="230" stroke="#a080d0" stroke-width="1.5"/><line x1="113" y1="255" x2="118" y2="233" stroke="#a080d0" stroke-width="1.5"/><circle cx="98" cy="233" r="3" fill="#e8d0ff"/><circle cx="108" cy="228" r="3" fill="#e8d0ff"/><circle cx="118" cy="231" r="3" fill="#e8d0ff"/><path d="M110 270 Q133 233 138 218 Q123 243 116 272 Z" fill="#d4a0c0"/></svg>')}`;

const NIGHT_GIRASSOL = `data:image/svg+xml,${encodeURIComponent('<svg viewBox="0 0 220 520" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="80" r="1.5" fill="#4fc3f7" opacity="0.7"/><circle cx="150" cy="50" r="1" fill="#4fc3f7" opacity="0.5"/><circle cx="190" cy="120" r="1.5" fill="#4fc3f7" opacity="0.6"/><circle cx="30" cy="160" r="1" fill="#4fc3f7" opacity="0.4"/><circle cx="200" cy="200" r="1.5" fill="#4fc3f7" opacity="0.7"/><circle cx="60" cy="300" r="1" fill="#4fc3f7" opacity="0.5"/><circle cx="170" cy="380" r="1.5" fill="#4fc3f7" opacity="0.4"/><path d="M110 490 Q108 400 105 340" stroke="#6b4c2a" stroke-width="4" fill="none" stroke-linecap="round"/><g transform="translate(90,250) rotate(-15)"><path d="M0,0 Q-30,-40 -20,-70" stroke="#3a7bd5" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M0,0 Q-45,-20 -50,-50" stroke="#3a7bd5" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M0,0 Q-40,10 -55,-10" stroke="#3a7bd5" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M0,0 Q-20,35 -30,50" stroke="#3a7bd5" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M0,0 Q10,40 0,60" stroke="#3a7bd5" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M0,0 Q30,30 45,15" stroke="#3a7bd5" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M0,0 Q40,-10 50,-30" stroke="#3a7bd5" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M0,0 Q25,-40 15,-65" stroke="#3a7bd5" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="0" cy="0" r="7" fill="#5b9ef7"/><circle cx="-20" cy="-65" r="3" fill="#4fc3f7"/><circle cx="-50" cy="-48" r="3" fill="#4fc3f7"/><circle cx="-53" cy="-8" r="3" fill="#4fc3f7"/><circle cx="-28" cy="52" r="3" fill="#4fc3f7"/><circle cx="2" cy="62" r="3" fill="#4fc3f7"/><circle cx="47" cy="17" r="3" fill="#4fc3f7"/><circle cx="52" cy="-28" r="3" fill="#4fc3f7"/><circle cx="17" cy="-63" r="3" fill="#4fc3f7"/></g><g transform="translate(140,205) rotate(20)"><path d="M0,0 Q-25,-35 -15,-60" stroke="#2563c7" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M0,0 Q-38,-15 -42,-40" stroke="#2563c7" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M0,0 Q-35,8 -45,-8" stroke="#2563c7" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M0,0 Q-15,30 -22,42" stroke="#2563c7" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M0,0 Q8,35 0,50" stroke="#2563c7" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M0,0 Q25,25 38,12" stroke="#2563c7" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M0,0 Q35,-8 42,-25" stroke="#2563c7" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M0,0 Q20,-33 12,-55" stroke="#2563c7" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="0" cy="0" r="6" fill="#3a7bd5"/><circle cx="-14" cy="-58" r="2.5" fill="#7ab8ff"/><circle cx="-40" cy="-38" r="2.5" fill="#7ab8ff"/><circle cx="-43" cy="-6" r="2.5" fill="#7ab8ff"/><circle cx="-20" cy="44" r="2.5" fill="#7ab8ff"/><circle cx="1" cy="52" r="2.5" fill="#7ab8ff"/><circle cx="40" cy="14" r="2.5" fill="#7ab8ff"/><circle cx="44" cy="-23" r="2.5" fill="#7ab8ff"/><circle cx="14" cy="-53" r="2.5" fill="#7ab8ff"/></g></svg>')}`;

const NIGHT_TULIPA = `data:image/svg+xml,${encodeURIComponent('<svg viewBox="0 0 220 520" xmlns="http://www.w3.org/2000/svg"><path d="M50,60 L51,65 L56,66 L51,67 L50,72 L49,67 L44,66 L49,65 Z" fill="white" opacity="0.9"/><path d="M180,100 L181,104 L185,105 L181,106 L180,110 L179,106 L175,105 L179,104 Z" fill="white" opacity="0.7"/><path d="M30,200 L31,203 L34,204 L31,205 L30,208 L29,205 L26,204 L29,203 Z" fill="white" opacity="0.6"/><path d="M200,310 L201,314 L205,315 L201,316 L200,320 L199,316 L195,315 L199,314 Z" fill="white" opacity="0.5"/><circle cx="110" cy="40" r="1.5" fill="#ffe066" opacity="0.7"/><circle cx="180" cy="150" r="1.5" fill="#ffe066" opacity="0.6"/><circle cx="25" cy="350" r="1.5" fill="#ffe066" opacity="0.5"/><circle cx="205" cy="420" r="1" fill="#ff6b4a" opacity="0.7"/><circle cx="60" cy="450" r="1" fill="#ff6b4a" opacity="0.5"/><path d="M110 490 Q108 440 106 400 Q108 350 110 280" stroke="#d4440a" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M108 400 Q85 370 65 358" stroke="#d4440a" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M108 400 Q131 370 153 358" stroke="#d4440a" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M110 490 Q75 450 55 400 Q80 410 103 455 Z" fill="#1e3a8a"/><path d="M110 490 Q75 435 60 385 Q82 400 107 455 Z" fill="#1e4aa0"/><path d="M110 490 Q145 450 163 400 Q138 410 117 455 Z" fill="#1e3a8a"/><path d="M110 490 Q145 435 158 385 Q136 400 113 455 Z" fill="#1e4aa0"/><path d="M110 490 Q70 415 75 368 Q93 385 105 448 Z" fill="#1e3a8a"/><path d="M110 490 Q150 415 145 368 Q127 385 115 448 Z" fill="#1e3a8a"/><g transform="translate(110,230)"><ellipse cx="0" cy="-40" rx="14" ry="22" fill="#f0eaff" transform="rotate(-5)"/><ellipse cx="-28" cy="-20" rx="13" ry="20" fill="#f0eaff" transform="rotate(-35)"/><ellipse cx="-28" cy="15" rx="13" ry="20" fill="#f0eaff" transform="rotate(-145)"/><ellipse cx="0" cy="38" rx="14" ry="22" fill="#f0eaff" transform="rotate(175)"/><ellipse cx="28" cy="15" rx="13" ry="20" fill="#f0eaff" transform="rotate(145)"/><ellipse cx="28" cy="-20" rx="13" ry="20" fill="#f0eaff" transform="rotate(35)"/><circle cx="0" cy="0" r="12" fill="#ff7a40"/><circle cx="0" cy="0" r="7" fill="#ff9a60"/></g><g transform="translate(67,315)"><ellipse cx="0" cy="-28" rx="10" ry="16" fill="#ece6ff" transform="rotate(-5)"/><ellipse cx="-20" cy="-14" rx="10" ry="15" fill="#ece6ff" transform="rotate(-35)"/><ellipse cx="-20" cy="10" rx="10" ry="15" fill="#ece6ff" transform="rotate(-145)"/><ellipse cx="0" cy="26" rx="10" ry="16" fill="#ece6ff" transform="rotate(175)"/><ellipse cx="20" cy="10" rx="10" ry="15" fill="#ece6ff" transform="rotate(145)"/><ellipse cx="20" cy="-14" rx="10" ry="15" fill="#ece6ff" transform="rotate(35)"/><circle cx="0" cy="0" r="9" fill="#ff7a40"/><circle cx="0" cy="0" r="5" fill="#ff9a60"/></g><g transform="translate(153,315)"><ellipse cx="0" cy="-28" rx="10" ry="16" fill="#ece6ff" transform="rotate(-5)"/><ellipse cx="-20" cy="-14" rx="10" ry="15" fill="#ece6ff" transform="rotate(-35)"/><ellipse cx="-20" cy="10" rx="10" ry="15" fill="#ece6ff" transform="rotate(-145)"/><ellipse cx="0" cy="26" rx="10" ry="16" fill="#ece6ff" transform="rotate(175)"/><ellipse cx="20" cy="10" rx="10" ry="15" fill="#ece6ff" transform="rotate(145)"/><ellipse cx="20" cy="-14" rx="10" ry="15" fill="#ece6ff" transform="rotate(35)"/><circle cx="0" cy="0" r="9" fill="#ff7a40"/><circle cx="0" cy="0" r="5" fill="#ff9a60"/></g></svg>')}`;

export const NIGHT_FLOWERS: { [key in 'rosa' | 'girassol' | 'tulipa']: { name: string; img: string } } = {
  rosa:     { name: 'Rosa',     img: NIGHT_ROSA },
  girassol: { name: 'Girassol', img: NIGHT_GIRASSOL },
  tulipa:   { name: 'Tulipa',   img: NIGHT_TULIPA },
};

@Component({
  selector: 'app-garden',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './garden.html',
  styleUrls: ['./garden.css'],
})
export class GardenComponent implements OnInit {

  FLOWERS = FLOWERS;
  NIGHT_FLOWERS = NIGHT_FLOWERS;

  // ── estado do jardim ──
  gardenId: string | null = null;
  gardenNome = 'Meu Jardim';
  flowers: PlantedFlower[] = [];
  isReadOnly = false;
  isNight = false;
  saving = false;
  saved = false;
  shareLink = '';
  showShareModal = false;
  toast: { msg: string; type: 'error' | 'success' } | null = null;

  stars: { x: number; y: number; size: number; delay: number }[] = Array.from({ length: 40 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 42,
    size: 1 + Math.random() * 2.5,
    delay: Math.random() * 4,
  }));

  // ── picker ──
  pickerOpen = false;

  // ── drag ──
  dragging = false;
  dragType: 'rosa' | 'girassol' | 'tulipa' | null = null;
  ghostX = 0;
  ghostY = 0;

  // ── modal plantar ──
  modalOpen    = false;
  pendingType: 'rosa' | 'girassol' | 'tulipa' | null = null;
  pendingX     = 0;
  pendingY     = 0;
  memTitle     = '';
  memMsg       = '';
  photoURL: string | null = null;

  // ── modal ver / editar ──
  viewing: PlantedFlower | null = null;
  editMode     = false;
  editTitle    = '';
  editMsg      = '';
  editPhotoURL: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gardenService: GardenService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
  ) {}

  ngOnInit() {
    // Se a rota tem um ID (?id=xxx ou /garden/:id), carrega do banco
    const id = this.route.snapshot.paramMap.get('id')
            || this.route.snapshot.queryParamMap.get('id');

    if (id) {
      this.gardenId = id;
      this.isReadOnly = true; // quem abre via link só visualiza
      this.loadGarden(id);
    }
  }

  // ── NAVEGAÇÃO ──
  goBack() { this.router.navigate(['/']); }

  // ── CARREGAR JARDIM DO BANCO ──
  loadGarden(id: string) {
    this.gardenService.findById(id).subscribe({
      next: g => this.ngZone.run(() => {
        this.gardenNome = g.nome || 'Meu Jardim';
        this.gardenId   = g.id ?? null;
        this.isNight    = g.theme?.sky === 'night';
        this.flowers    = (g.flowers ?? []).map((f: any, i: number) => ({
          id:       i,
          type:     f.type as 'rosa' | 'girassol' | 'tulipa',
          x:        f.position?.x ?? 50,
          y:        f.position?.y ?? 60,
          titulo:   f.memory?.title ?? f.type,
          mensagem: f.memory?.message ?? '',
          imageURL: f.memory?.imageUrl ?? null,
        }));
      }),
      error: () => this.showToast('Jardim não encontrado ou link inválido.', 'error')
    });
  }

  // ── SALVAR / ATUALIZAR JARDIM ──
  saveGarden() {
    this.saving = true;

    const backendFlowers = this.flowers.map(f => ({
      id: String(f.id),
      type: f.type,
      position: { x: Math.round(f.x), y: Math.round(f.y) },
      memory: { title: f.titulo, message: f.mensagem, imageUrl: f.imageURL, audioUrl: null },
    }));

    const body = {
      nome: this.gardenNome,
      theme: { sky: this.isNight ? 'night' : 'day', music: null, weatherEffect: null },
      flowers: backendFlowers,
    };

    const req = this.gardenId
      ? this.gardenService.update(this.gardenId, body)
      : this.gardenService.create(body);

    req.subscribe({
      next: g => this.ngZone.run(() => {
        this.gardenId       = g.id ?? null;
        this.saving         = false;
        this.saved          = true;
        this.shareLink      = `${window.location.origin}${window.location.pathname}#/garden/${g.id}`;
        this.showShareModal = true;
        setTimeout(() => this.saved = false, 3000);
      }),
      error: () => this.ngZone.run(() => {
        this.saving = false;
        this.showToast('Erro ao salvar o jardim. Tente novamente.', 'error');
      })
    });
  }

  copyLink() {
    navigator.clipboard.writeText(this.shareLink);
  }

  private showToast(msg: string, type: 'error' | 'success') {
    this.toast = { msg, type };
    setTimeout(() => (this.toast = null), 4000);
  }

  closeShareModal() { this.showShareModal = false; }

  toggleNight() { this.isNight = !this.isNight; }

  // ── PICKER ──
  togglePicker(e: Event) {
    e.stopPropagation();
    this.pickerOpen = !this.pickerOpen;
  }
  closePicker() { this.pickerOpen = false; }

  // ── DRAG START ──
  onMouseDown(e: MouseEvent, type: 'rosa' | 'girassol' | 'tulipa') {
    e.preventDefault();
    e.stopPropagation();
    this.startDrag(type, e.clientX, e.clientY);
  }

  onTouchStart(e: TouchEvent, type: 'rosa' | 'girassol' | 'tulipa') {
    e.preventDefault();
    e.stopPropagation();
    this.startDrag(type, e.touches[0].clientX, e.touches[0].clientY);
  }

  private startDrag(type: 'rosa' | 'girassol' | 'tulipa', x: number, y: number) {
    this.dragType   = type;
    this.dragging   = true;
    this.ghostX     = x;
    this.ghostY     = y;
    this.pickerOpen = false;
  }

  // ── DRAG MOVE ──
  onContainerMouseMove(e: MouseEvent) {
    if (!this.dragging) return;
    this.ghostX = e.clientX;
    this.ghostY = e.clientY;
  }

  onContainerTouchMove(e: TouchEvent) {
    if (!this.dragging) return;
    e.preventDefault();
    this.ghostX = e.touches[0].clientX;
    this.ghostY = e.touches[0].clientY;
  }

  @HostListener('window:mousemove', ['$event'])
  onWindowMouseMove(e: MouseEvent) {
    if (!this.dragging) return;
    this.ghostX = e.clientX;
    this.ghostY = e.clientY;
  }

  @HostListener('window:mouseup', ['$event'])
  onWindowMouseUp(e: MouseEvent) {
    if (!this.dragging) return;
    this.drop(e.clientX, e.clientY);
  }

  @HostListener('window:touchmove', ['$event'])
  onWindowTouchMove(e: TouchEvent) {
    if (!this.dragging) return;
    this.ghostX = e.touches[0].clientX;
    this.ghostY = e.touches[0].clientY;
  }

  @HostListener('window:touchend', ['$event'])
  onWindowTouchEnd(e: TouchEvent) {
    if (!this.dragging) return;
    this.drop(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
  }

  // ── DROP ──
  private drop(clientX: number, clientY: number) {
    const relX = (clientX / window.innerWidth)  * 100;
    const relY = (clientY / window.innerHeight) * 100;
    const type = this.dragType;

    this.dragging = false;
    this.dragType = null;

    if (relY > 45 && type) {
      this.pendingType = type;
      this.pendingX    = relX;
      this.pendingY    = relY;
      this.memTitle    = '';
      this.memMsg      = '';
      this.photoURL    = null;
      this.modalOpen   = true;
    }
  }

  // ── MODAL PLANTAR ──
  cancelModal() {
    this.modalOpen   = false;
    this.pendingType = null;
  }

  confirmPlant() {
    if (!this.pendingType) return;
    this.flowers.push({
      id:       Date.now(),
      type:     this.pendingType,
      x:        this.pendingX,
      y:        this.pendingY,
      titulo:   this.memTitle || FLOWERS[this.pendingType].name,
      mensagem: this.memMsg,
      imageURL: this.photoURL,
    });
    this.modalOpen   = false;
    this.pendingType = null;
  }

  onPhotoSelected(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (file.size > 1_048_576) {
      this.showToast('A foto deve ter no máximo 1MB.', 'error');
      (e.target as HTMLInputElement).value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => this.ngZone.run(() => { this.photoURL = ev.target?.result as string; });
    reader.readAsDataURL(file);
  }

  // ── MODAL VER / EDITAR ──
  openFlower(f: PlantedFlower) {
    if (this.dragging) return;
    this.viewing      = f;
    this.editMode     = false;
    this.editTitle    = f.titulo;
    this.editMsg      = f.mensagem;
    this.editPhotoURL = f.imageURL;
  }

  closeViewing() {
    this.viewing  = null;
    this.editMode = false;
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  onEditPhotoSelected(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (file.size > 1_048_576) {
      this.showToast('A foto deve ter no máximo 1MB.', 'error');
      (e.target as HTMLInputElement).value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => this.ngZone.run(() => { this.editPhotoURL = ev.target?.result as string; });
    reader.readAsDataURL(file);
  }

  saveEdit() {
    if (!this.viewing) return;
    this.viewing.titulo   = this.editTitle || this.viewing.titulo;
    this.viewing.mensagem = this.editMsg;
    this.viewing.imageURL = this.editPhotoURL;
    this.editMode = false;
  }

  removeFlower() {
    if (!this.viewing) return;
    this.flowers  = this.flowers.filter(f => f.id !== this.viewing!.id);
    this.viewing  = null;
    this.editMode = false;
  }

  // ── HELPERS ──
  flowerSize(y: number) { return Math.round(40 + (0.5 + (y / 100) * 0.9) * 30); }
  stopProp(e: Event)    { e.stopPropagation(); }
  getFlowerImg(type: 'rosa' | 'girassol' | 'tulipa' | null): string {
    if (!type) return '';
    return (this.isNight ? NIGHT_FLOWERS : FLOWERS)[type].img;
  }
}