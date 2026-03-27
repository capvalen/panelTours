<template>
	<div class="modal fade" id="modalIngreso" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header  border-0">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Registrar entrada de caja</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>Seleccione el motivo de ingreso</p>
				<select name="salida" id="" class="form-select">
					<option value="1">Ingreso</option>
					<option value="2">Inyección de dinero</option>
				</select>
				<p>Monto (S)</p>
				<input type="number" class="form-control" autocomplete="off">
				<p>Datos extras</p>
				<input type="text" class="form-control" autocomplete="off">
      </div>
      <div class="modal-footer border-0">
        <button type="button" class="btn btn-outline-primary">Registrar ingreso</button>
      </div>
    </div>
  </div>
</div>
</template>