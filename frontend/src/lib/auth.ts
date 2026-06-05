import {configureAuth} from 'react-query-auth';
import { Navigate , useLocation } from '@tanstack/react-router';
import {z} from 'zod';

import { paths } from '../config/paths';
import api from './api-client.ts'