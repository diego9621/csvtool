let customExporter = {};

customExporter.render = function (data, config, env) {
  const container = document.getElementById('container');
  container.innerHTML = '';

  const fields = data.fields;
  const rows = data.rows;

  // Create checkboxes
  const checkboxContainer = document.createElement('div');
  checkboxContainer.id = 'checkboxes';
  checkboxContainer.style.marginBottom = '10px';
  fields.forEach((field, i) => {
    const label = document.createElement('label');
    label.style.marginRight = '10px';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = i;
    checkbox.checked = true;
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(' ' + field.name));
    checkboxContainer.appendChild(label);
  });

  container.appendChild(checkboxContainer);

  // Download Button
  const btn = document.createElement('button');
  btn.textContent = 'Download Selected CSV';
  btn.style.marginTop = '10px';
  btn.onclick = () => {
    const selectedIndexes = Array.from(container.querySelectorAll('input[type=checkbox]:checked'))
      .map(cb => parseInt(cb.value));

    const selectedHeaders = selectedIndexes.map(i => fields[i].name);
    let csv = selectedHeaders.join(',') + '\n';

    rows.forEach(row => {
      const line = selectedIndexes.map(i => `"${row[i].formatted || row[i].value}"`).join(',');
      csv += line + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'custom_export.csv';
    link.click();
  };

  container.appendChild(btn);
};

customExporter.draw = function (el, config) {
  el.innerHTML = `<div id="container" style="font-family:sans-serif;"></div>`;
};

looker.plugins.visualizations.add(customExporter);