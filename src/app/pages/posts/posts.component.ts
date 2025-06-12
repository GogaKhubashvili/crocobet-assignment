import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Post } from '../../models/post.interface';
import { User } from '../../models/user.interface';
import { ModalComponent } from '../../components/modal/modal.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
})
export class PostsComponent implements OnInit {
  postsList = signal<Post[]>([]);
  usersList = signal<User[]>([]);
  selectedUserId = signal<number | null>(null);
  selectedPostData = signal<Post | null>(null);
  showModal = signal(false);
  userId = signal('');
  selectedUserName = signal<string>('');
  postUserNames = signal<{ [key: number]: string }>({});

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {
    this.userId.set(this.route.snapshot.queryParamMap.get('userId') || '');
    if (this.userId()) {
      this.selectedUserId.set(+this.userId());
      this.loadPostsByUser(+this.userId());
    } else {
      this.loadAllPosts();
    }
    this.loadUsers();
  }

  private loadAllPosts() {
    this.dataService
      .getPosts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (postsData) => {
          this.postsList.set(postsData);
          this.updatePostUserNames();
        },
      });
  }

  private loadPostsByUser(userId: number) {
    this.dataService
      .getPostsByUserId(userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (postsData) => {
          this.postsList.set(postsData);
          this.updatePostUserNames();
        },
      });
  }

  private loadUsers() {
    this.dataService
      .getUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (usersData) => {
          this.usersList.set(usersData);
          this.updateSelectedUserName();
          this.updatePostUserNames();
        },
      });
  }

  private updateSelectedUserName() {
    if (this.selectedUserId()) {
      const userFound = this.usersList().find(
        (u) => u.id === this.selectedUserId()!
      );
      this.selectedUserName.set(userFound ? userFound.name : 'Unknown User');
    }
  }

  private updatePostUserNames() {
    const namesMapping: { [key: number]: string } = {};
    for (let i = 0; i < this.postsList().length; i++) {
      const currentPost = this.postsList()[i];
      const userFound = this.usersList().find(
        (u) => u.id === currentPost.userId
      );
      namesMapping[currentPost.userId] = userFound
        ? userFound.name
        : 'Unknown User';
    }
    this.postUserNames.set(namesMapping);
  }

  getUserNameById(userId: number) {
    const userFound = this.usersList().find((u) => u.id === userId);
    return userFound ? userFound.name : 'Unknown User';
  }

  openPostDetailsModal(postData: Post) {
    this.selectedPostData.set(postData);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedPostData.set(null);
  }
}
