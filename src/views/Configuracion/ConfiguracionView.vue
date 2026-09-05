<script setup>
import { onMounted, ref, nextTick, watch } from 'vue';
import api from '@/services/axios';
import { useAuthStore } from '@/stores/auth';
import { useConfiguracionStore } from '@/stores/configuracionStore';
import Swal from 'sweetalert2';

const authStore = useAuthStore();
const configStore = useConfiguracionStore();

const title = ref('Configuraciones');
const activeTab = ref('password');

// ── Quill editor ──
const editorContainer = ref(null);
let quillInstance = null;

const initQuill = () => {
	nextTick(() => {
		if (quillInstance) return;
		const el = editorContainer.value;
		if (!el) return;
		quillInstance = new Quill(el, {
			theme: 'snow',
			placeholder: 'Escribe el contenido de la temporada...',
			modules: {
				toolbar: [
					[{ header: [1, 2, 3, false] }],
					['bold', 'italic', 'underline'],
					[{ list: 'ordered' }, { list: 'bullet' }],
					['link', 'image'],
					['clean'],
				],
			},
		});
	});
};

// ── Temporadas ──
const temporadaForm = ref({ titulo: '', contenido: '' });
const editandoId = ref(null);
const editandoRegistroId = ref(null);

const cargarTemporadas = async () => {
	await configStore.cargarTemporadas();
};

const guardarTemporada = async () => {
	if (!temporadaForm.value.titulo.trim()) {
		Swal.fire('Aviso', 'El título es obligatorio', 'warning');
		return;
	}
	const contenido = quillInstance ? quillInstance.root.innerHTML : '';
	if (!contenido || contenido === '<p><br></p>') {
		Swal.fire('Aviso', 'El contenido es obligatorio', 'warning');
		return;
	}

	try {
		if (editandoRegistroId.value) {
			await configStore.actualizarTemporada(editandoRegistroId.value, temporadaForm.value.titulo.trim(), contenido);
			Swal.fire('Éxito', 'Temporada actualizada', 'success');
		} else {
			await configStore.guardarTemporada(temporadaForm.value.titulo.trim(), contenido);
			Swal.fire('Éxito', 'Temporada creada', 'success');
		}
		resetFormTemporada();
	} catch {
		Swal.fire('Error', 'No se pudo guardar la temporada', 'error');
	}
};

const editarTemporada = (t) => {
	temporadaForm.value.titulo = t.titulo;
	editandoId.value = t.id;
	editandoRegistroId.value = t.id;
	nextTick(() => {
		initQuill();
		if (quillInstance) {
			quillInstance.root.innerHTML = t.valor?.contenido || '';
		}
	});
};

const eliminarTemporada = async (t) => {
	const result = await Swal.fire({
		title: '¿Eliminar temporada?',
		text: 'Esta acción no se puede deshacer',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Sí, eliminar',
		cancelButtonText: 'Cancelar',
	});
	if (!result.isConfirmed) return;

	try {
		await configStore.eliminarTemporada(t.id);
		Swal.fire('Eliminado', 'Temporada eliminada', 'success');
		resetFormTemporada();
	} catch {
		Swal.fire('Error', 'No se pudo eliminar la temporada', 'error');
	}
};

const resetFormTemporada = () => {
	temporadaForm.value = { titulo: '', contenido: '' };
	editandoId.value = null;
	editandoRegistroId.value = null;
	if (quillInstance) {
		quillInstance.root.innerHTML = '';
	}
};

// ── Usuarios ──
const passwordForm = ref({
	currentPassword: '',
	newPassword: '',
	confirmPassword: ''
});

const users = ref([]);
const loadingUsers = ref(false);

const isUserModalOpen = ref(false);
const isPasswordModalOpen = ref(false);
const editingUserId = ref(null);
const targetExternalUser = ref(null);

const userForm = ref({
	nombre: '',
	user: '',
	perfil: 'agente',
	activo: true,
	password: ''
});

const externalPasswordForm = ref({
	newPassword: '',
	confirmPassword: ''
});

const changePassword = async () => {
	if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
		alert('Las contraseñas no coinciden');
		return;
	}
	if (passwordForm.value.newPassword.length < 8) {
		alert('La contraseña debe tener al menos 8 caracteres');
		return;
	}
	try {
		await api.put('/cambiar-password', {
			currentPassword: passwordForm.value.currentPassword,
			newPassword: passwordForm.value.newPassword
		});
		alert('Contraseña cambiada correctamente');
		passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' };
	} catch (error) {
		const msg = error.response?.data?.message || 'No se pudo cambiar la contraseña';
		alert(msg);
	}
};

const openCreateUserModal = () => {
	editingUserId.value = null;
	userForm.value = {
		nombre: '',
		user: '',
		perfil: 'counter',
		activo: true,
		password: ''
	};
	isUserModalOpen.value = true;
};

const openEditUserModal = (user) => {
	editingUserId.value = user.id;
	userForm.value = {
		nombre: user.nombre,
		user: user.user,
		perfil: user.perfil || 'counter',
		activo: user.activo ?? true,
		password: ''
	};
	isUserModalOpen.value = true;
};

const closeUserModal = () => {
	isUserModalOpen.value = false;
};

const listarUsuarios = async () => {
	loadingUsers.value = true;
	try {
		const response = await api.get('/usuarios');
		users.value = Array.isArray(response.data) ? response.data : [];
	} catch (error) {
		console.error(error);
		alert('No se pudo listar usuarios');
	} finally {
		loadingUsers.value = false;
	}
};

const saveUserApi = async () => {
	try {
		const payload = {
			nombre: userForm.value.nombre,
			user: userForm.value.user,
			perfil: userForm.value.perfil,
			activo: userForm.value.activo ? 1 : 0
		};

		if (!editingUserId.value || userForm.value.password) {
			payload.password = userForm.value.password;
		}

		if (!editingUserId.value && !payload.password) {
			alert('La clave es obligatoria para crear usuario');
			return;
		}

		if (editingUserId.value) {
			await api.put(`/usuarios/${editingUserId.value}`, payload);
			alert('Usuario actualizado correctamente');
		} else {
			await api.post('/usuarios', payload);
			alert('Usuario creado correctamente');
		}

		closeUserModal();
		await listarUsuarios();
	} catch (error) {
		console.error(error);
		alert('No se pudo guardar el usuario');
	}
};

const deleteUserApi = async (user) => {
	try {
		await api.delete(`/usuarios/${user.id}`);
		alert('Usuario eliminado');
		await listarUsuarios();
	} catch (error) {
		console.error(error);
		alert('No se pudo eliminar el usuario');
	}
};

const openExternalPasswordModal = (user) => {
	targetExternalUser.value = user;
	externalPasswordForm.value = { newPassword: '', confirmPassword: '' };
	isPasswordModalOpen.value = true;
};

const closeExternalPasswordModal = () => {
	isPasswordModalOpen.value = false;
	targetExternalUser.value = null;
};

const changeExternalUserPassword = async () => {
	if (!targetExternalUser.value) return;
	if (externalPasswordForm.value.newPassword !== externalPasswordForm.value.confirmPassword) {
		alert('Las contraseñas no coinciden');
		return;
	}
	if (externalPasswordForm.value.newPassword.length < 8) {
		alert('La contraseña debe tener al menos 8 caracteres');
		return;
	}

	try {
		await api.put(`/usuarios/${targetExternalUser.value.id}`, {
			password: externalPasswordForm.value.newPassword
		});
		alert(`Clave actualizada para ${targetExternalUser.value.nombre}`);
		closeExternalPasswordModal();
		await listarUsuarios();
	} catch (error) {
		console.error(error);
		alert('No se pudo cambiar la clave');
	}
};

const saveUser = async () => {
	if (!userForm.value.nombre || !userForm.value.user) {
		alert('Completa nombre y usuario');
		return;
	}
	await saveUserApi();
};

const deleteUserAction = async (user) => {
	const shouldDelete = confirm(`¿Eliminar al usuario ${user.nombre}?`);
	if (!shouldDelete) return;
	await deleteUserApi(user);
};

// Watch for tab changes to init Quill when switching to temporadas
watch(activeTab, (val) => {
	if (val === 'temporadas') {
		initQuill();
	}
});

onMounted(() => {
	if (authStore.user?.perfil === 'administrador') {
		listarUsuarios();
	}
	cargarTemporadas();
});
</script>

<template>
	<h1>{{ title }}</h1>
	<div class="config-panel">
		<ul class="nav nav-tabs mb-3">
			<li class="nav-item" v-if="authStore.user?.perfil === 'administrador'">
				<button class="nav-link" :class="{ active: activeTab === 'usuarios' }" @click="activeTab = 'usuarios'">
					<i class="bi bi-people me-1"></i> Usuarios
				</button>
			</li>
			<li class="nav-item">
				<button class="nav-link" :class="{ active: activeTab === 'password' }" @click="activeTab = 'password'">
					<i class="bi bi-key me-1"></i> Mi contraseña
				</button>
			</li>
			<li class="nav-item">
				<button class="nav-link" :class="{ active: activeTab === 'temporadas' }" @click="activeTab = 'temporadas'">
					<i class="bi bi-calendar-event me-1"></i> Contenido de temporadas
				</button>
			</li>
		</ul>

		<!-- ══════════ TAB: USUARIOS ══════════ -->
		<div class="config-section" v-if="activeTab === 'usuarios' && authStore.user?.perfil === 'administrador'">
			<div class="section-header">
				<h3>Usuarios</h3>
				<button class="btn btn-outline-primary" @click="openCreateUserModal"><i class="bi bi-person-plus"></i> Nuevo usuario</button>
			</div>
			<table class="users-table">
				<thead>
					<tr>
						<th>#</th>
						<th>Nombre</th>
						<th>Usuario</th>
						<th>Perfil</th>
						<th>Estado</th>
						<th>Tipo</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					<tr v-if="loadingUsers">
						<td colspan="7">Cargando usuarios...</td>
					</tr>
					<tr v-else-if="users.length === 0">
						<td colspan="7">No hay usuarios registrados</td>
					</tr>
					<tr v-for="(user, index) in users" :key="user.id">
						<td>{{ index + 1 }}</td>
						<td>{{ user.nombre }}</td>
						<td>{{ user.user }}</td>
						<td class="text-capitalize">{{ user.perfil || '-' }}</td>
						<td>{{ user.activo ? 'Activo' : 'Inactivo' }}</td>
						<td>Interno</td>
						<td class="actions-cell">
							<button class="btn btn-outline-primary btn-sm" @click="openEditUserModal(user)"><i class="bi bi-pencil"></i> Editar</button>
							<button class="btn btn-outline-danger btn-sm" @click="deleteUserAction(user)"><i class="bi bi-trash"></i> Eliminar</button>
							<button class="btn btn-outline-secondary btn-sm" @click="openExternalPasswordModal(user)">
								<i class="bi bi-key"></i> Cambiar clave
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- ══════════ TAB: CONTRASEÑA ══════════ -->
		<div class="config-section" v-if="activeTab === 'password'">
			<h3>Cambiar contraseña</h3>
			<form @submit.prevent="changePassword">
				<div class="form-group">
					<label for="currentPassword">Contraseña actual:</label>
					<input type="password" id="currentPassword" v-model="passwordForm.currentPassword" required />
				</div>
				<div class="form-group">
					<label for="newPassword">Nueva contraseña:</label>
					<input type="password" id="newPassword" v-model="passwordForm.newPassword" required minlength="8" />
				</div>
				<div class="form-group">
					<label for="confirmPassword">Confirmar nueva contraseña:</label>
					<input type="password" id="confirmPassword" v-model="passwordForm.confirmPassword" required />
				</div>
				<button type="submit" class="btn btn-outline-primary"><i class="bi bi-passport"></i> Cambiar contraseña</button>
			</form>
		</div>

		<!-- ══════════ TAB: TEMPORADAS ══════════ -->
		<div class="config-section" v-if="activeTab === 'temporadas'">
			<div class="row g-4">
				<!-- Formulario a la izquierda -->
				<div class="col-md-5">						<h3>{{ editandoId !== null ? 'Editar temporada' : 'Nueva temporada' }}</h3>
					<form @submit.prevent="guardarTemporada">
						<div class="form-group">
							<label>Título <span class="text-danger">*</span></label>
							<input type="text" class="form-control" v-model="temporadaForm.titulo" placeholder="Ej: Temporada alta 2025" required>
						</div>
						<div class="form-group">
							<label>Contenido <span class="text-danger">*</span></label>
							<div class="quill-wrapper">
								<div ref="editorContainer"></div>
							</div>
						</div>
						<div class="d-flex gap-2">
							<button type="submit" class="btn btn-primary">
								<i class="bi" :class="editandoId !== null ? 'bi-check-lg' : 'bi-plus-lg'"></i>
								{{ editandoId !== null ? 'Actualizar' : 'Guardar' }}
							</button>
							<button v-if="editandoId !== null" type="button" class="btn btn-outline-secondary" @click="resetFormTemporada">
								Cancelar
							</button>
						</div>
					</form>
				</div>

				<!-- Lista de temporadas a la derecha -->
				<div class="col-md-7">						<h3>Temporadas registradas</h3>
					<div v-if="configStore.temporadas.length === 0" class="text-muted text-center py-4">
						<i class="bi bi-inbox fs-1"></i>
						<p class="mt-2">No hay temporadas registradas</p>
					</div>
					<div v-else class="temporadas-list">
						<div v-for="t in configStore.temporadas" :key="t.id" class="temporada-card">
							<div class="temporada-header">
								<h5 class="mb-0">{{ t.valor?.titulo }}</h5>
								<div class="d-flex gap-1">
									<button class="btn btn-sm btn-outline-primary" @click="editarTemporada(t)" title="Editar">
										<i class="bi bi-pencil"></i>
									</button>
									<button class="btn btn-sm btn-outline-danger" @click="eliminarTemporada(t)" title="Eliminar">
										<i class="bi bi-trash"></i>
									</button>
								</div>
							</div>
							<div class="temporada-contenido" v-html="t.valor?.contenido"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- ══════════ MODAL: USUARIO ══════════ -->
	<div class="modal-backdrop" v-if="isUserModalOpen" @click.self="closeUserModal">
		<div class="modal-card">
			<h3>{{ editingUserId ? 'Editar usuario' : 'Nuevo usuario' }}</h3>
			<form @submit.prevent="saveUser">
				<div class="form-group">
					<label for="userName">Nombre</label>
					<input id="userName" type="text" v-model="userForm.nombre" required />
				</div>
				<div class="form-group">
					<label for="username">Usuario</label>
					<input id="username" type="text" v-model="userForm.user" required />
				</div>
				<div class="form-group">
					<label for="userRole">Rol</label>
					<select id="userRole" v-model="userForm.perfil">
						<option value="administrador">Administrador</option>
						<option value="counter">Counter</option>
						<option value="logística">Logística</option>
						<option value="caja">Caja</option>
					</select>
				</div>
				<div class="form-group">
					<label for="userPassword">Clave {{ editingUserId ? '(opcional)' : '' }}</label>
					<input id="userPassword" type="password" v-model="userForm.password" :required="!editingUserId" minlength="5" />
				</div>
				<div class="modal-actions">
					<button type="button" class="btn btn-outline-secondary" @click="closeUserModal">Cancelar</button>
					<button type="submit" class="btn btn-outline-primary">Guardar</button>
				</div>
			</form>
		</div>
	</div>

	<!-- ══════════ MODAL: CONTRASEÑA EXTERNA ══════════ -->
	<div class="modal-backdrop" v-if="isPasswordModalOpen" @click.self="closeExternalPasswordModal">
		<div class="modal-card">
			<h3>Cambiar clave de {{ targetExternalUser?.nombre }}</h3>
			<form @submit.prevent="changeExternalUserPassword">
				<div class="form-group">
					<label for="extPassword">Nueva clave</label>
					<input id="extPassword" type="password" v-model="externalPasswordForm.newPassword" minlength="8" required />
				</div>
				<div class="form-group">
					<label for="extPasswordConfirm">Confirmar clave</label>
					<input id="extPasswordConfirm" type="password" v-model="externalPasswordForm.confirmPassword" required />
				</div>
				<div class="modal-actions">
					<button type="button" class="btn btn-outline-secondary" @click="closeExternalPasswordModal">Cancelar</button>
					<button type="submit" class="btn btn-outline-primary">Actualizar clave</button>
				</div>
			</form>
		</div>
	</div>
</template>

<style scoped>
.config-panel {
	max-width: 1100px;
	margin: 0 auto;
	padding: 1rem;
}

.nav-tabs .nav-link {
	color: #64748b;
	border: none;
	border-bottom: 2px solid transparent;
	border-radius: 0;
	padding: 0.65rem 1.1rem;
	font-weight: 500;
	background: transparent;
	transition: all 0.2s ease;
}

.nav-tabs .nav-link:hover {
	color: #0d6efd;
	border-bottom-color: #93c5fd;
}

.nav-tabs .nav-link.active {
	color: #0d6efd;
	border-bottom: 2px solid #0d6efd;
	background: transparent;
}

.config-section {
	background: #f8f9fa;
	border-radius: 8px;
	padding: 1.5rem;
	box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.config-section h3 {
	margin-top: 0;
	color: #333;
}

.form-group {
	margin-bottom: 1rem;
}

.form-group label {
	display: block;
	margin-bottom: 0.5rem;
	font-weight: bold;
}

.form-group input,
.form-group select {
	width: 100%;
	padding: 0.75rem;
	border: 1px solid #ddd;
	border-radius: 4px;
	font-size: 1rem;
	box-sizing: border-box;
}

.form-group input:focus {
	outline: none;
	border-color: #007bff;
	box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1rem;
}

.users-table {
	width: 100%;
	border-collapse: collapse;
	background: #fff;
}

.users-table th,
.users-table td {
	border: 1px solid #e2e8f0;
	padding: 0.65rem;
	text-align: left;
}

.actions-cell {
	display: flex;
	gap: 0.35rem;
	flex-wrap: wrap;
}

.btn-sm {
	padding: 0.35rem 0.55rem;
	font-size: 0.85rem;
}

.modal-backdrop {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.45);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 1rem;
	z-index: 1050;
}

.modal-card {
	background: #fff;
	border-radius: 10px;
	width: 100%;
	max-width: 480px;
	padding: 1rem;
}

.modal-actions {
	display: flex;
	justify-content: flex-end;
	gap: 0.5rem;
	margin-top: 1rem;
}

/* ── Quill wrapper ── */
.quill-wrapper {
	background: #fff;
	border: 1px solid #ddd;
	border-radius: 4px;
}

.quill-wrapper :deep(.ql-toolbar) {
	border-radius: 4px 4px 0 0;
	border-color: #ccc;
}

.quill-wrapper :deep(.ql-container) {
	border-radius: 0 0 4px 4px;
	border-color: #ccc;
	min-height: 200px;
	font-size: 0.95rem;
}

/* ── Temporadas list ── */
.temporadas-list {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.temporada-card {
	background: #fff;
	border: 1px solid #e2e8f0;
	border-radius: 8px;
	padding: 1rem;
	transition: box-shadow 0.2s;
}

.temporada-card:hover {
	box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.temporada-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 0.75rem;
	padding-bottom: 0.5rem;
	border-bottom: 1px solid #f1f5f9;
}

.temporada-header h5 {
	font-size: 1.05rem;
	font-weight: 600;
	color: #1e293b;
}

.temporada-contenido {
	font-size: 0.9rem;
	color: #475569;
	line-height: 1.6;
}

.temporada-contenido :deep(img) {
	max-width: 100%;
	border-radius: 4px;
	margin: 0.5rem 0;
}

.temporada-contenido :deep(ul),
.temporada-contenido :deep(ol) {
	padding-left: 1.5rem;
	margin: 0.5rem 0;
}
</style>
