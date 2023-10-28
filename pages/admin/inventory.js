import React from "react";
import DisconnectedGuard from "../../components/guards/disconnectedGuard";
import AdminLayout from "../../components/admin/AdminLayout";
import styles from "../../styles/admin/Dashboard.module.scss";
import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  Pager,
  Paging,
  SearchPanel,
} from "devextreme-react/data-grid";
function Inventory(props) {
  const products = [{ designation: "product", qty: 10, price: "1200" }];
  return (
    <AdminLayout>
      <DisconnectedGuard>
        <section className={styles.container}>
          <DataGrid
            dataSource={products}
            editing={{ allowAdding: true, mode: "popup" }}
            allowColumnReordering={true}
            rowAlternationEnabled={false}
            showBorders={true}
            width="100%"
          >
            <GroupPanel visible={true} />
            <SearchPanel visible={true} highlightCaseSensitive={true} />
            <Grouping autoExpandAll={false} />
            <Column
              dataField="designation"
              caption="designation"
              dataType="string"
            />
            <Column dataField="qty" caption="quantity" dataType="number" />
            <Column
              dataField="price"
              caption="price"
              dataType="number"
              format="currency"
            />
            <Column
              dataField="image"
              caption="image"
              dataType="file"
              visible={false}
            />

            <Pager allowedPageSizes={10} showPageSizeSelector={true} />
            <Paging defaultPageSize={10} />
          </DataGrid>
        </section>
      </DisconnectedGuard>
    </AdminLayout>
  );
}

export default Inventory;
