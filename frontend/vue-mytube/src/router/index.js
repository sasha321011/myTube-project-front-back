import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import UploadVideo from '../views/UploadVideo.vue';
import VideoDetail from '../views/VideoDetail.vue';
import RegisterView from '../views/RegisterView.vue';
import LoginView from '../views/LoginView.vue';
import ActivateAccountView from '../views/ActivateAccountView.vue';
import LikedVideos from "../views/LikedVideos.vue";
import LikedPlaylists from "../views/LikedPlaylists.vue";
import PlaylistVideos from '../views/PlaylistVideos.vue';
import UserProfile from "../views/UserProfile.vue";
import MyVideos from "../views/MyVideos.vue";
import MyPlaylists from "../views/MyPlaylists.vue";
import CreatePlaylist from "../views/CreatePlaylist.vue";

import AuthorProfile from "../views/AuthorProfile.vue";
import AuthorPlaylists from "../views/AuthorPlaylists.vue";
import AuthorVideos from "../views/AuthorVideos.vue";
const routes = [
  {
    path: '/profile/:username',
    name: 'user-profile',
    component: AuthorProfile, // Компонент профиля пользователя
  },
  {
    path: '/author-playlists/:author',  // Путь для плейлистов с параметром
    name: 'author-playlists',           // Имя маршрута
    component: AuthorPlaylists,         // Компонент для отображения плейлистов
  },
  {
    path: '/author-videos/:author',     // Путь для видео с параметром
    name: 'author-videos',              // Имя маршрута
    component: AuthorVideos,            // Компонент для отображения видео
  },
  {
    path: '/',
    name: 'home',
    component: HomeView, // Главная страница
  },
  {
    path: "/my-videos/:author",
    name: "MyVideos",
    component: MyVideos,
  },
  {
    path: "/my-playlists/:author",
    name: "my-playlists",
    component: MyPlaylists,
  },
  {
    path: "/create-playlist",
    name: "CreatePlaylist",
    component: CreatePlaylist,
  },
  {
    path: '/upload',
    name: 'upload',
    component: UploadVideo, // Страница загрузки видео
  },
  { path: "/liked-videos", name: "liked-videos", component: LikedVideos },
  { path: "/liked-playlists", name: "liked-playlists", component: LikedPlaylists },
  {
    path: '/playlist/:slug',
    name: 'playlist-detail',
    component: PlaylistVideos,
  },
  {
    path: "/profile",
    name: "UserProfile",
    component: UserProfile,
  },
  {
    path: '/video-detail/:slug',
    name: 'video-detail',
    component: VideoDetail, // Страница просмотра видео
    props: true, // передаем параметры маршрута как пропсы
  },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/activation/:uid/:token', name: 'activate-account', component: ActivateAccountView ,props: true,},
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
