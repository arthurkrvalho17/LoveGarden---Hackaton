import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

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

export interface Garden {
  _id?: string;
  nome: string;
  flores: PlantedFlower[];
  criadoEm?: string;
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

const API = environment.apiUrl;

@Component({
  selector: 'app-garden',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './garden.html',
  styleUrls: ['./garden.css'],
})
export class GardenComponent implements OnInit {

  FLOWERS = FLOWERS;

  // ── estado do jardim ──
  gardenId: string | null = null;
  gardenNome = 'Meu Jardim';
  flowers: PlantedFlower[] = [];
  isReadOnly = false; // true quando acessado via link compartilhado
  saving = false;
  saved = false;
  shareLink = '';
  showShareModal = false;
  toast: { msg: string; type: 'error' | 'success' } | null = null;

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
    private http: HttpClient,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.http.get<any>(`${API}/garden/${id}`).subscribe({
      next: g => {
        this.gardenNome = g.nome || 'Meu Jardim';
        this.gardenId   = g.id;
        this.flowers    = (g.flowers ?? []).map((f: any, i: number) => ({
          id:       i,
          type:     f.type as 'rosa' | 'girassol' | 'tulipa',
          x:        f.position?.x ?? 50,
          y:        f.position?.y ?? 60,
          titulo:   f.memory?.title ?? f.type,
          mensagem: f.memory?.message ?? '',
          imageURL: f.memory?.imageUrl ?? null,
        }));
      },
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

    const body = { nome: this.gardenNome, theme: null, flowers: backendFlowers };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const req = this.gardenId
      ? this.http.put<any>(`${API}/garden/${this.gardenId}`, body)
      : this.http.post<any>(`${API}/garden`, body);

    req.subscribe({
      next: g => {
        this.gardenId       = g.id;
        this.saving         = false;
        this.saved          = true;
        this.shareLink      = `${window.location.origin}${window.location.pathname}#/garden/${g.id}`;
        this.showShareModal = true;
        setTimeout(() => this.saved = false, 3000);
      },
      error: () => {
        this.saving = false;
        this.showToast('Erro ao salvar o jardim. Tente novamente.', 'error');
      }
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
    reader.onload = ev => { this.photoURL = ev.target?.result as string; };
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
    reader.onload = ev => { this.editPhotoURL = ev.target?.result as string; };
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
}