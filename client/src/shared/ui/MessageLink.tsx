import { AnchorHTMLAttributes, DetailedHTMLProps } from 'react';
import { Link } from 'react-router-dom';

const MessageLink = (props: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) => (
    <Link {...props} target='_blank' to={props.href ?? '#'} className='text-primary-blue hover:underline' />
);

export default MessageLink;