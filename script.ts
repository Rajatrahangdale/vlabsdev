interface Animal {
  name: string;
  image: string;
  location: string;
  size: number;
  weight: number;
}

class AnimalTable {
  private animals: Animal[];
  private tableId: string;
  private sortableFields: string[];
  private currentEditIndex: number | null = null;

  constructor(animals: Animal[], tableId: string, sortableFields: string[]) {
    this.animals = animals;
    this.tableId = tableId;
    this.sortableFields = sortableFields;
    this.renderTable();
  }

  private renderTable(): void {
    const container = document.getElementById(this.tableId);
    if (!container) return;

    container.innerHTML = `<div class="overflow-auto">
      <table class="table table-bordered">
        <thead>
          <tr>
            ${["Name", "Image", "Location", "Size", "Weight", "Actions"]
              .map(
                (field) =>
                  `<th class=${this.sortableFields.includes(field.toLowerCase())&&  "pointer"} onclick="animalTables['${this.tableId}'].sortTable('${field.toLowerCase()}')">
                    ${field} ${
                    this.sortableFields.includes(field.toLowerCase()) ? "&#x25B2;&#x25BC;" : ""
                  }
                  </th>`
              )
              .join("")}
          </tr>
        </thead>
        <tbody>
          ${this.animals
            .map(
              (animal, index) =>
                `<tr>
                  <td style="${this.tableId ==="big-fish-table" && "color: blue;"}" class="${this.tableId ==="dogs-table" ? "bold" : this.tableId ==="big-fish-table" ? "bold italic blue" : ""}">
                    ${animal.name}
                  </td>
                  <td><img src="${animal.image}" alt="${animal.name}"></td>
                  <td>${animal.location}</td>
                  <td>${animal.size} ft</td>
                  <td>${animal.weight} Kg</td>
                  <td>
                    <button class="btn btn-warning btn-sm" onclick="animalTables['${this.tableId}'].editAnimal(${index})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="animalTables['${this.tableId}'].deleteAnimal(${index})">Delete</button>
                  </td>
                </tr>`
            )
            .join("")}
        </tbody>
      </table> </div>
      <div class="mt-3">
        <h5>${this.currentEditIndex !== null ? "Edit Animal" : "Add New Animal"}</h5>
        <input id="${this.tableId}-name" type="text" placeholder="Name" class="form-control mb-2">
        <input id="${this.tableId}-image" type="text" placeholder="Image URL" class="form-control mb-2">
        <input id="${this.tableId}-location" type="text" placeholder="Location" class="form-control mb-2">
        <input id="${this.tableId}-size" type="number" placeholder="Size (in numbers)" class="form-control mb-2">
        <input id="${this.tableId}-weight" type="number" placeholder="Weight (in numbers)" class="form-control mb-2">
        <button class="btn btn-primary" onclick="animalTables['${this.tableId}'].submitForm()">
          ${this.currentEditIndex !== null ? "Update Animal" : "Add Animal"}
        </button>
        ${this.currentEditIndex !== null ? `<button class="btn btn-secondary" onclick="animalTables['${this.tableId}'].cancelEdit()">Cancel</button>`: ""}
      </div>
    `;

    if (this.currentEditIndex !== null) {
      this.fillForm(this.animals[this.currentEditIndex]);
    }
  }
  

  public sortTable(field: keyof Animal): void {
    if (!this.sortableFields.includes(field)) return;
    this.animals.sort((a, b) => {
    if (typeof a[field] === "number" && typeof b[field] === "number") {
      return a[field] - b[field]; // Numeric comparison
    } else {
      return a[field].toString().localeCompare(b[field].toString()); // String comparison
    }
  });
    this.renderTable();
  }

  public addAnimal(): void {
    const newAnimal = this.getFormData();
    if (!newAnimal.name || this.animals.some((a) => a.name === newAnimal.name)) {
      alert("Animal already exists or invalid input.");
      return;
    }

    this.animals.push(newAnimal);
    this.renderTable();
  }

  public editAnimal(index: number): void {
    this.currentEditIndex = index;
    this.renderTable();
  }

  public deleteAnimal(index: number): void {
    this.animals.splice(index, 1);
    this.currentEditIndex = null;
    this.renderTable();
  }

  public submitForm(): void {
    const updatedAnimal = this.getFormData();

    if (!updatedAnimal.name) {
      alert("Name is required.");
      return;
    }
    if (!updatedAnimal.image) {
      alert("Image URL is required.");
      return;
    }
    if (!updatedAnimal.location) {
      alert("Location is required.");
      return;
    }
    if (!updatedAnimal.size) {
      alert("Size is required.");
      return;
    }
    if (!updatedAnimal.weight) {
      alert("Weight is required.");
      return;
    }

    if (this.currentEditIndex !== null) {
      this.animals[this.currentEditIndex] = updatedAnimal;
      this.currentEditIndex = null;
    } else {
      if (this.animals.some((a) => a.name === updatedAnimal.name)) {
        alert("Animal already exists.");
        return;
      }
      this.animals.push(updatedAnimal);
    }

    this.renderTable();
  }

  public cancelEdit(): void {
    this.currentEditIndex = null;
    this.renderTable();
  }

  private getFormData(): Animal {
    return {
      name: (document.getElementById(`${this.tableId}-name`) as HTMLInputElement).value.trim(),
      image: (document.getElementById(`${this.tableId}-image`) as HTMLInputElement).value.trim(),
      location: (document.getElementById(`${this.tableId}-location`) as HTMLInputElement).value.trim(),
      size: Number((document.getElementById(`${this.tableId}-size`) as HTMLInputElement).value.trim()),
      weight: Number((document.getElementById(`${this.tableId}-weight`) as HTMLInputElement).value.trim()),
    };
  }

  private fillForm(animal: Animal): void {
    (document.getElementById(`${this.tableId}-name`) as HTMLInputElement).value = animal.name;
    (document.getElementById(`${this.tableId}-image`) as HTMLInputElement).value = animal.image;
    (document.getElementById(`${this.tableId}-location`) as HTMLInputElement).value = animal.location;
    (document.getElementById(`${this.tableId}-size`) as HTMLInputElement).value = animal.size.toString();
    (document.getElementById(`${this.tableId}-weight`) as HTMLInputElement).value = animal.weight.toString();
  }
}

const bigCats: Animal[] = [
  { name: "Tiger", image: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXdR6z7oIX9bZH_pG0hjUKEMxN01pMmgMuBh84bs_DGYsmiMx2MBEqPM37MvydHQtrSnq5tU9zAZCKf7qRYw5cqTKi60dMH0t8_zU20e3v2gtQZfk8wB249JNLoykZc7ASBaD2WbyQ?key=diMK_80ckKTiDYYhCkLD1Q", location: "Asia", size: 10 , weight: 190 },
  { name: "Lion", image: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXchn5N9RSe7xRp6BeknXRUq_L7QiArehEGDFBpscJdKczZxAvblxAPL2v7UOu4KNozPnGSoRkoSD-eZGJG0vXn8RCNXvQ_iX62Xpw5FudUL6hxKSM8lb5OtUPTsbIuh0o8pw_K1nA?key=diMK_80ckKTiDYYhCkLD1Q", location: "Africa", size: 8, weight: 220 },
  { name: "Leopard", image: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXes0lpkoEgH2n3P5Cp1d-g0GIzbx-FBMw-cqnrN7qGP1yLD6jLixHoc4V8ikZPNWZD-v92d87X_pOCrOhwGmCVJ-j-m4xTMS6itpsCX_McEEYHdpS3a8cPy5EAwKmoJEfHKZDR2?key=diMK_80ckKTiDYYhCkLD1Q", location: "Africa and Asia", size: 5, weight: 120 },
  { name: "Cheetah", image: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXfduP5N2OixBbRUKQFFGwfMspycyil8vRSVIjGcIhRILYuxYJVcA85GUWvfghuoLvNhrqKD1HEAPxxJKdmHU73lZTx65Wa0_t0rwz_BIrbHu5L3WR6EwGTM7y9RlQNMWg6cc_mp3A?key=diMK_80ckKTiDYYhCkLD1Q", location: "Africa", size: 5, weight: 170 },
  { name: "Caracal", image: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXdyt8sZ1fGZ64WJZu7ysUZVn4Ll_nkbaW7O1JNj2BMnWmA4cTZwSh2qdvB5RQXrhdWCxXs9RRFLEZwLEDuKLVU82YxMsYh1XAMGE3emrtpR-hk2AWwRKVkO2LdaphFCD-DRzLttYA?key=diMK_80ckKTiDYYhCkLD1Q", location: "Africa", size: 3, weight: 160 },
  { name: "Jaguar", image: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXf7C2lvfVMKhXkJP6B3DiBMllAernSn8bBE55Ay1SS9YtdNXYu1Qd4KaRIYG0d_3g4GnyBCQfd8UMTcucPq8FCLw5f14gLfJ564O8lsc7B9LP0X3kpAMhH04IEl-nrqnS9FiPPX1w?key=diMK_80ckKTiDYYhCkLD1Q", location: "Amazon", size: 5, weight: 200 },
];

const dogs: Animal[] = [
  { name: "Rotwailer", image: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXcu9_YnZ0yJbpIzo6C6i-fMDJOw8EVqBOk-cGiDOF2c7gV107Sam5Q5-bDdOLCf5-t6ho2JUJsaTpWITw_kx5XTga5RrHGv7ZJB5_ln28zZAzdFA0e5FmN2oItewLnU12E4PK83?key=diMK_80ckKTiDYYhCkLD1Q", location: "Germany", size: 2, weight: 50 },
  { name: "German Shepherd", image: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXcr-YFSPpoSrh2AwQsoFe6obHZQddBzfdiu5w8J5ZDGTAkqknRlQuEai6SdWkae_Svw0aH4uEhvh4DPMm_k9HTKKHZEe71PUA7JkFk1M1wPBriyrxfrLeL6mMTDj86951bXP6IiEA?key=diMK_80ckKTiDYYhCkLD1Q", location: "Germany", size: 2.3, weight: 40 },
  { name: "Labrodar", image: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXf0kgf_0zGqJJUuQCIfRjZHBvmwEBxh4J4tLi7LAcx7cjv_e4kfTpbukKEEvrFxd74YdXhvioDR98aBYGAsHL8H7yYvYLGrFkhD4UXzvdsBJLNBg50JK8NHR2T5kHKqpM5fJsXyOw?key=diMK_80ckKTiDYYhCkLD1Q", location: "UK", size: 3, weight: 35 },
  { name: "Alabai", image: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXfLrqmSUbbyUrmQzI9lP2XFirC9cayTgkLF3t0x5ImdbK8UD64e5cGn1I3tq6rBL8U5FlIvFEgnxDAH8Z0b0wVtjX5r8lL8dRpFI13aHq_36sshKirJ0Br9JwdUNIFuIia97KPuAw?key=diMK_80ckKTiDYYhCkLD1Q", location: "Turkey", size: 4, weight: 60 },
];

const bigFish: Animal[] = [
  { name: "Humpback Whale", image: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXfwYblHlVBNftaGMkaMo8LYMxvosJ1YS6Lnb8SX9OA6YbhJKUt2_VIQSPFXFzJIUFY57s-Yp6SGjZruSqyPBYil1K7nIVVfQ_IZRNPXmOOlRc-vRwVD3yd6eBZkIuANDtPD2B1gxQ?key=diMK_80ckKTiDYYhCkLD1Q", location: "Atlantic Ocean", size: 15, weight: 80 },
  { name: "Killer Whale", image: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXdYoK0SpFvgNfTB0W_SzXXLBBzeUe4aeGkKLDIzIYL01xKMR0h3sDz9yllzfRzKdVEt-h8NXEyZBkRbodzt_GF_bFY3vgP0Q3dyhj7x8_g8SbmQA6YxU7N-1ufeKfiVNoxkf6Nn?key=diMK_80ckKTiDYYhCkLD1Q", location: "Atlantic Ocean", size: 12, weight: 60 },
  { name: "Tiger Shark", image: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXccXOaDC9h2EwNXBPfETTRlnzY7bea6fINQ4nGYmZW18JGK3EBIq4jZkEJFKWwBuMKd3Yqj1Si_3R_cmLJIHDDbLeQE7mRf4rCAmtmsAo8sJV_qr1lDOhb7OYfTPjVz2Rl8JJga?key=diMK_80ckKTiDYYhCkLD1Q", location: "Ocean", size: 8, weight: 70 },
  { name: "Hammerhead Shark", image: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXcJbccuOeLL82ElmGzvFWQ6CkR28z2mlBQ07g1tcMw3XxPeyYSvySRVXnYWD8FL635OTe5VBcPxhpod3CLqyrYJOkyV-RGA6JO09cy3B4OTstT8LsPnS226CPEb5KAgzTCOX91K?key=diMK_80ckKTiDYYhCkLD1Q", location: "Ocean", size: 8, weight: 100 },
];

const animalTables: Record<string, AnimalTable> = {
  "big-cats-table": new AnimalTable(bigCats, "big-cats-table", ["name", "location", "size", "weight"]),
  "dogs-table": new AnimalTable(dogs, "dogs-table", ["name", "location"]),
  "big-fish-table": new AnimalTable(bigFish, "big-fish-table", ["size"]),
};
