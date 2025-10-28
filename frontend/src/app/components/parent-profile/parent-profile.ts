import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth';
import { ParentService, ChildProfile } from '../../services/parent';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-parent-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './parent-profile.html',
  styleUrl: './parent-profile.scss'
})
export class ParentProfileComponent implements OnInit {
  profileForm: FormGroup;
  children: ChildProfile[] = [];
  isLoading = false;
  uid: string | null = null;

  childForm: FormGroup;
  editingChildId: string | null = null;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private parentService: ParentService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.profileForm = this.fb.group({
      displayName: [''],
      email: ['', [Validators.email]],
      phone: ['']
    });

    this.childForm = this.fb.group({
      name: ['', Validators.required],
      grade: ['', Validators.required],
      age: ['']
    });
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      // redirect to login if not authenticated
      this.router.navigate(['/login']);
      return;
    }
    this.uid = user.uid;
    // Check query param to determine if profile should be displayed in view-only mode
    const mode = this.route.snapshot.queryParamMap.get('mode');
    this.isViewMode = mode === 'view';
    this.loadProfile();
    this.loadChildren();
  }

  async loadProfile(): Promise<void> {
    if (!this.uid) return;
    this.isLoading = true;
    try {
      const profile = await this.parentService.getParent(this.uid);
      if (profile) {
        this.profileForm.patchValue({
          displayName: profile.displayName || '',
          email: profile.email || '',
          phone: profile.phone || ''
        });
      } else {
        // If no profile exists in Firestore, try to populate from Google account
        const user = this.authService.getCurrentUser();
        if (user) {
          const googleDisplayName = user.displayName || '';
          const googleEmail = user.email || '';
          const googlePhone = (user as any).phoneNumber || '';
          const googlePhoto = user.photoURL || '';

          this.profileForm.patchValue({
            displayName: googleDisplayName,
            email: googleEmail,
            phone: googlePhone
          });

          // Create the parent document using the available Google info
          await this.parentService.updateParent(this.uid, {
            displayName: googleDisplayName,
            email: googleEmail,
            phone: googlePhone,
            photoURL: googlePhoto,
            createdAt: new Date()
          });
          this.showMessage('Profile created from Google account');
        }
      }
    } catch (error) {
      console.error('Error loading profile', error);
      this.showMessage('Error loading profile');
    } finally {
      this.isLoading = false;
    }
  }

  async saveProfile(): Promise<void> {
    if (!this.uid) return;
    if (this.profileForm.invalid) return;
    try {
      this.isLoading = true;
      await this.parentService.updateParent(this.uid, this.profileForm.value);
      this.showMessage('Profile updated');
    } catch (error) {
      console.error('Error updating profile', error);
      this.showMessage('Error updating profile');
    } finally {
      this.isLoading = false;
    }
  }

  async loadChildren(): Promise<void> {
    if (!this.uid) return;
    try {
      this.children = await this.parentService.getChildren(this.uid);
    } catch (error) {
      console.error('Error loading children', error);
      this.showMessage('Error loading children');
    }
  }

  async addOrUpdateChild(): Promise<void> {
    if (!this.uid) return;
    if (this.childForm.invalid) return;
    const payload = this.childForm.value;
    try {
      this.isLoading = true;
      if (this.editingChildId) {
        await this.parentService.updateChild(this.uid, this.editingChildId, payload);
        this.showMessage('Child updated');
      } else {
        await this.parentService.addChild(this.uid, payload);
        this.showMessage('Child added');
      }
      this.childForm.reset();
      this.editingChildId = null;
      await this.loadChildren();
    } catch (error) {
      console.error('Error saving child', error);
      this.showMessage('Error saving child');
    } finally {
      this.isLoading = false;
    }
  }

  editChild(child: ChildProfile): void {
    this.editingChildId = child.id || null;
    this.childForm.patchValue({ name: child.name, grade: child.grade, age: child.age });
  }

  async deleteChild(child: ChildProfile): Promise<void> {
    if (!this.uid || !child.id) return;
    if (!confirm(`Delete child ${child.name}?`)) return;
    try {
      await this.parentService.deleteChild(this.uid, child.id);
      this.showMessage('Child deleted');
      await this.loadChildren();
    } catch (error) {
      console.error('Error deleting child', error);
      this.showMessage('Error deleting child');
    }
  }

  private showMessage(msg: string): void {
    this.snackBar.open(msg, 'Close', { duration: 3000, horizontalPosition: 'end', verticalPosition: 'top' });
  }

  isViewMode = false;
}
