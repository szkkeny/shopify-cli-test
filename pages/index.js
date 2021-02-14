import React from "react";
import { EmptyState, Page, Layout, Button } from "@shopify/polaris";
import { ResourcePicker, TitleBar } from "@shopify/app-bridge-react";
import store from "store-js";
import ResourceListWithProducts from "../components/ResourceList";
import Cookies from "js-cookie";
import axios from "axios";

const img = "https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg";
const options = {
  page: {
    title: "Warranty information",
    body_html:
      "<h2>Warranty</h2>\n<p>Returns accepted if we receive items <strong>30 days after purchase</strong>.</p>",
  },
};

class Index extends React.Component {
  state = { open: false };
  render() {
    const emptyState = !store.get("ids");
    const config = {
      apiKey: API_KEY,
      shopOrigin: Cookies.get("shopOrigin"),
      forceRedirect: true,
    };

    return (
      <Page>
        <TitleBar
          title="Sample App"
          primaryAction={{
            content: "Select products",
            onAction: () => this.setState({ open: true }),
          }}
        />
        <Button
          onClick={() => {
            axios.post(
              `${Cookies.get("shopOrigin")}/admin/api/2021-01/pages.json`,
              options
            );
            console.log(Cookies.get("shopOrigin"));
          }}
        >
          test
        </Button>
        <ResourcePicker
          resourceType="Product"
          showVariants={false}
          open={this.state.open}
          onSelection={(resources) => this.handleSelection(resources)}
          onCancel={() => this.setState({ open: false })}
        />

        {emptyState ? (
          <Layout>
            <EmptyState
              heading="Discount your products temporarily"
              action={{
                content: "Select products",
                onAction: () => this.setState({ open: true }),
              }}
              image={img}
            >
              <p>Select products to change their price temporarily.</p>
            </EmptyState>
          </Layout>
        ) : (
          <ResourceListWithProducts />
        )}
      </Page>
    );
  }
  handleSelection = (resources) => {
    const idsFromResources = resources.selection.map((product) => product.id);
    this.setState({ open: false });
    store.set("ids", idsFromResources);
  };
}

export default Index;
