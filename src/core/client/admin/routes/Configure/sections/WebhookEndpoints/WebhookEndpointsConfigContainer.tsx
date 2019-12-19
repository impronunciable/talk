import { Localized } from "@fluent/react/compat";
import { Match, Router, withRouter } from "found";
import React, { FunctionComponent, useCallback } from "react";

import { urls } from "coral-framework/helpers";
import { ExternalLink } from "coral-framework/lib/i18n/components";
import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import {
  Button,
  ButtonIcon,
  CallOut,
  FormFieldDescription,
  HorizontalGutter,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "coral-ui/components/v2";

import { WebhookEndpointsConfigContainer_settings } from "coral-admin/__generated__/WebhookEndpointsConfigContainer_settings.graphql";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import Subheader from "../../Subheader";
import WebhookEndpointRow from "./WebhookEndpointRow";

interface Props {
  router: Router;
  match: Match;
  settings: WebhookEndpointsConfigContainer_settings;
}

const WebhookEndpointsConfigContainer: FunctionComponent<Props> = ({
  settings,
  router,
}) => {
  const onAddEndpoint = useCallback(() => {
    router.push(urls.admin.addWebhookEndpoint);
  }, [router]);

  return (
    <HorizontalGutter size="double">
      <ConfigBox
        title={
          <Localized id="configure-webhooks-header-title">
            <Header htmlFor="configure-webhooks-header.title">Webhooks</Header>
          </Localized>
        }
      >
        <Localized
          id="configure-webhooks-description"
          externalLink={
            <ExternalLink href="https://docs.coralproject.net/coral/v5/integrating/webhooks/" />
          }
        >
          <FormFieldDescription>
            Configure an endpoint to send events to when events occur within
            Coral. These events will be JSON encoded and signed. To learn more
            about webhook signing, visit our{" "}
            <ExternalLink href="https://docs.coralproject.net/coral/v5/integrating/webhooks/">
              our docs
            </ExternalLink>
            .
          </FormFieldDescription>
        </Localized>
        <Button color="dark" onClick={onAddEndpoint}>
          <ButtonIcon size="md">add</ButtonIcon>
          <Localized id="configure-webhooks-addEndpointButton">
            Add webhook endpoint
          </Localized>
        </Button>
        <Localized id="configure-webhooks-endpoints">
          <Subheader>Endpoints</Subheader>
        </Localized>
        {settings.webhooks.endpoints.length > 0 ? (
          <Table fullWidth>
            <TableHead>
              <TableRow>
                <Localized id="configure-webhooks-url">
                  <TableCell>URL</TableCell>
                </Localized>

                <Localized id="configure-webhooks-status">
                  <TableCell>Status</TableCell>
                </Localized>
              </TableRow>
            </TableHead>
            <TableBody>
              {settings.webhooks.endpoints.map((endpoint, idx) => (
                <WebhookEndpointRow key={idx} endpoint={endpoint} />
              ))}
            </TableBody>
          </Table>
        ) : (
          <Localized id="configure-webhooks-noEndpoints">
            <CallOut color="regular" fullWidth>
              There are no webhook endpoints configured, add one above.
            </CallOut>
          </Localized>
        )}
      </ConfigBox>
    </HorizontalGutter>
  );
};

const enhanced = withRouter(
  withFragmentContainer<Props>({
    settings: graphql`
      fragment WebhookEndpointsConfigContainer_settings on Settings {
        webhooks {
          endpoints {
            ...WebhookEndpointRow_webhookEndpoint
          }
        }
      }
    `,
  })(WebhookEndpointsConfigContainer)
);

export default enhanced;
