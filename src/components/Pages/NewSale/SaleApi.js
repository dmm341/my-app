const API_URL= "http://localhost:5000/Sales"
const SaleService ={
  /**
   * create a new sale
   * @param {object} SaleData -sale details
   */
  createSale: async(SaleData)=> {
    try{
      const response = await fetch(API_URL,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(SaleData),
      });
      if (!response.ok){
        throw await response.json();
      }
      return await response.json();
    }catch (error){
      throw error.message || "failed to create sale";
    }
  },
  /**
   * get all sales
   */
  getSales:async ()=>{
    try{
      const response=await fetch(API_URL);
      if (!response.ok){
        throw await response.json();
      }
      return await response.json();
    }catch (error) {
      throw error.message || "failed to fetch sales";
    }
  },
  /**
   * update an existing order 
   * @param {string} SaleId -saleid
   * @param {object} updatedData -updated sale details
   */
  updateSale: async(SaleId,updatedData)=>{
    try {
      const response =await fetch(`${API_URL}/${SaleId}`,{
        method:"put",
        headers:{
          "Content-Type" : "application/json",
        },
        body:JSON.stringify(updatedData),
      });
      if (!response.ok){
        throw await response.json();
      }
      return await response.json();
    }catch (error) {
      throw error.message || "failed to update sale";
    }
  },
  /**
   * delete a sale
   * @param {string} SaleId -Sale id
   */
  deleteSale:async(SaleId) =>{
    try {
      const response= await fetch(`${API_URL}/${SaleId}`,{
        method:"DELETE",
      });
      if (!response.ok){
        throw await response.json();
      }
      return await response.json();
    }catch (error) {
      throw error.message || "failed to delete sale";
    }
  },
};
export default SaleService;
