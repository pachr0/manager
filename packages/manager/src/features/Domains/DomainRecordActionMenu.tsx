import { Domain } from '@linode/api-v4/lib/domains';

import { append, compose, has, when } from 'ramda';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import ActionMenu, { Action } from 'src/components/ActionMenu/ActionMenu';

interface EditPayload {
  id?: number;
  name?: string;
  service?: string | null;
  target?: string;
  ttl_sec?: number;
  priority?: number;
  protocol?: string | null;
  port?: number;
  weight?: number;
  tag?: string | null;
}

interface DeleteData {
  recordID: number;
  onDelete: (id: number) => void;
}

interface Props {
  onEdit: (data: Domain | EditPayload) => void;
  deleteData?: DeleteData;
  editPayload: Domain | EditPayload;
  label: string;
}

type CombinedProps = Props & RouteComponentProps<{}>;

class DomainRecordActionMenu extends React.Component<CombinedProps> {
  handleEdit = () => {
    const { editPayload, onEdit } = this.props;
    onEdit(editPayload);
  };

  handleDelete = () => {
    const { deleteData } = this.props;
    deleteData!.onDelete(deleteData!.recordID);
  };

  createActions = () => (closeMenu: () => void): Action[] =>
    compose<Action[], Action[], Action[]>(
      when(
        () => has('deleteData', this.props),
        append({
          title: 'Delete',
          onClick: (e: React.MouseEvent<HTMLElement>) => {
            this.handleDelete();
            closeMenu();
            e.preventDefault();
          },
        })
      ),
      append({
        title: 'Edit',
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          this.handleEdit();
          closeMenu();
          e.preventDefault();
        },
      })
    )([]);
  render() {
    return (
      <ActionMenu
        createActions={this.createActions()}
        ariaLabel={`Action menu for Record ${this.props.label}`}
      />
    );
  }
}

export default withRouter(DomainRecordActionMenu);
