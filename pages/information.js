import { Card, Layout, Page } from '@shopify/polaris';

const Information = () => (
  <Page>
    <Layout>
      <Layout.AnnotatedSection
        title="Title"
        description="Description"
      >
        <Card>
          <div>Put content here</div>
          <a href="https://polaris.shopify.com/components/structure/layout">For more information see Polaris docs</a>
        </Card>
      </Layout.AnnotatedSection>
    </Layout>
    <Layout>
      <Layout.AnnotatedSection
        title="Title"
        description="Description"
      >
        <Card>
          Put content here
        </Card>
      </Layout.AnnotatedSection>
    </Layout>
  </Page>
  );
  export default Information;