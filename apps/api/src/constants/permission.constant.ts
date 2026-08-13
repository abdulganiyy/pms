export const PERMISSIONS = {
  // =========================================================
  // DASHBOARD
  // =========================================================

  DASHBOARD_VIEW: 'dashboard.view',
  DASHBOARD_VIEW_OCCUPANCY: 'dashboard.view_occupancy',
  DASHBOARD_VIEW_REVENUE: 'dashboard.view_revenue',
  DASHBOARD_VIEW_ARRIVALS: 'dashboard.view_arrivals',
  DASHBOARD_VIEW_DEPARTURES: 'dashboard.view_departures',
  DASHBOARD_VIEW_IN_HOUSE: 'dashboard.view_in_house',
  DASHBOARD_VIEW_HOUSEKEEPING: 'dashboard.view_housekeeping',
  DASHBOARD_VIEW_MAINTENANCE: 'dashboard.view_maintenance',
  DASHBOARD_VIEW_FINANCIALS: 'dashboard.view_financials',

  // =========================================================
  // RESERVATIONS
  // =========================================================

  RESERVATIONS_VIEW: 'reservations.view',
  RESERVATIONS_VIEW_ALL: 'reservations.view_all',
  RESERVATIONS_CREATE: 'reservations.create',
  RESERVATIONS_UPDATE: 'reservations.update',
  RESERVATIONS_CANCEL: 'reservations.cancel',
  RESERVATIONS_CONFIRM: 'reservations.confirm',
  RESERVATIONS_HOLD: 'reservations.hold',
  RESERVATIONS_MODIFY_DATES: 'reservations.modify_dates',
  RESERVATIONS_MODIFY_GUESTS: 'reservations.modify_guests',
  RESERVATIONS_MODIFY_RATE: 'reservations.modify_rate',
  RESERVATIONS_CHANGE_ROOM: 'reservations.change_room',
  RESERVATIONS_ASSIGN_ROOM: 'reservations.assign_room',
  RESERVATIONS_UNASSIGN_ROOM: 'reservations.unassign_room',
  RESERVATIONS_CHECK_IN: 'reservations.check_in',
  RESERVATIONS_CHECK_OUT: 'reservations.check_out',
  RESERVATIONS_NO_SHOW: 'reservations.no_show',
  RESERVATIONS_REINSTATE: 'reservations.reinstate',
  RESERVATIONS_DUPLICATE: 'reservations.duplicate',
  RESERVATIONS_PRINT: 'reservations.print',
  RESERVATIONS_EXPORT: 'reservations.export',
  RESERVATIONS_DELETE: 'reservations.delete',

  // =========================================================
  // GUESTS
  // =========================================================

  GUESTS_VIEW: 'guests.view',
  GUESTS_VIEW_SENSITIVE: 'guests.view_sensitive',
  GUESTS_CREATE: 'guests.create',
  GUESTS_UPDATE: 'guests.update',
  GUESTS_MERGE: 'guests.merge',
  GUESTS_ARCHIVE: 'guests.archive',
  GUESTS_RESTORE: 'guests.restore',
  GUESTS_DELETE: 'guests.delete',
  GUESTS_VIEW_HISTORY: 'guests.view_history',
  GUESTS_VIEW_STAYS: 'guests.view_stays',
  GUESTS_VIEW_PAYMENTS: 'guests.view_payments',
  GUESTS_VIEW_REVIEWS: 'guests.view_reviews',
  GUESTS_ADD_NOTES: 'guests.add_notes',
  GUESTS_ADD_PREFERENCES: 'guests.add_preferences',
  GUESTS_EXPORT: 'guests.export',

  // Identity / scanner
  GUESTS_VERIFY_IDENTITY: 'guests.verify_identity',
  GUESTS_CAPTURE_DOCUMENT: 'guests.capture_document',
  GUESTS_VIEW_DOCUMENT: 'guests.view_document',
  GUESTS_UPDATE_DOCUMENT: 'guests.update_document',
  GUESTS_DELETE_DOCUMENT: 'guests.delete_document',
  GUESTS_SCAN_DOCUMENT: 'guests.scan_document',

  // =========================================================
  // ROOMS
  // =========================================================

  ROOMS_VIEW: 'rooms.view',
  ROOMS_CREATE: 'rooms.create',
  ROOMS_UPDATE: 'rooms.update',
  ROOMS_DELETE: 'rooms.delete',
  ROOMS_ASSIGN: 'rooms.assign',
  ROOMS_UNASSIGN: 'rooms.unassign',
  ROOMS_BLOCK: 'rooms.block',
  ROOMS_UNBLOCK: 'rooms.unblock',
  ROOMS_MARK_AVAILABLE: 'rooms.mark_available',
  ROOMS_MARK_OCCUPIED: 'rooms.mark_occupied',
  ROOMS_MARK_DIRTY: 'rooms.mark_dirty',
  ROOMS_MARK_CLEAN: 'rooms.mark_clean',
  ROOMS_MARK_CLEANING: 'rooms.mark_cleaning',
  ROOMS_MARK_INSPECTING: 'rooms.mark_inspecting',
  ROOMS_MARK_OUT_OF_SERVICE: 'rooms.mark_out_of_service',
  ROOMS_MARK_OUT_OF_ORDER: 'rooms.mark_out_of_order',
  ROOMS_VIEW_HISTORY: 'rooms.view_history',
  ROOMS_VIEW_STATUS: 'rooms.view_status',
  ROOMS_EXPORT: 'rooms.export',

  // =========================================================
  // ROOM TYPES
  // =========================================================

  ROOM_TYPES_VIEW: 'room_types.view',
  ROOM_TYPES_CREATE: 'room_types.create',
  ROOM_TYPES_UPDATE: 'room_types.update',
  ROOM_TYPES_DELETE: 'room_types.delete',
  ROOM_TYPES_CONFIGURE_RATES: 'room_types.configure_rates',
  ROOM_TYPES_CONFIGURE_OCCUPANCY: 'room_types.configure_occupancy',
  ROOM_TYPES_CONFIGURE_AMENITIES: 'room_types.configure_amenities',

  // =========================================================
  // RATES
  // =========================================================

  RATES_VIEW: 'rates.view',
  RATES_CREATE: 'rates.create',
  RATES_UPDATE: 'rates.update',
  RATES_DELETE: 'rates.delete',
  RATES_PUBLISH: 'rates.publish',
  RATES_UNPUBLISH: 'rates.unpublish',
  RATES_CONFIGURE_SEASON: 'rates.configure_season',
  RATES_CONFIGURE_WEEKEND: 'rates.configure_weekend',
  RATES_CONFIGURE_OCCUPANCY: 'rates.configure_occupancy',
  RATES_CONFIGURE_RESTRICTIONS: 'rates.configure_restrictions',
  RATES_CONFIGURE_MIN_STAY: 'rates.configure_min_stay',
  RATES_CONFIGURE_MAX_STAY: 'rates.configure_max_stay',
  RATES_CONFIGURE_ADVANCE_BOOKING: 'rates.configure_advance_booking',
  RATES_OVERRIDE: 'rates.override',

  // =========================================================
  // AVAILABILITY
  // =========================================================

  AVAILABILITY_VIEW: 'availability.view',
  AVAILABILITY_UPDATE: 'availability.update',
  AVAILABILITY_BLOCK: 'availability.block',
  AVAILABILITY_UNBLOCK: 'availability.unblock',
  AVAILABILITY_OVERRIDE: 'availability.override',
  AVAILABILITY_EXPORT: 'availability.export',

  // =========================================================
  // HOUSEKEEPING
  // =========================================================

  HOUSEKEEPING_VIEW: 'housekeeping.view',
  HOUSEKEEPING_VIEW_SCHEDULE: 'housekeeping.view_schedule',
  HOUSEKEEPING_CREATE_TASK: 'housekeeping.create_task',
  HOUSEKEEPING_ASSIGN_TASK: 'housekeeping.assign_task',
  HOUSEKEEPING_REASSIGN_TASK: 'housekeeping.reassign_task',
  HOUSEKEEPING_START_TASK: 'housekeeping.start_task',
  HOUSEKEEPING_COMPLETE_TASK: 'housekeeping.complete_task',
  HOUSEKEEPING_INSPECT_ROOM: 'housekeeping.inspect_room',
  HOUSEKEEPING_APPROVE_ROOM: 'housekeeping.approve_room',
  HOUSEKEEPING_REJECT_ROOM: 'housekeeping.reject_room',
  HOUSEKEEPING_REPORT_ISSUE: 'housekeeping.report_issue',
  HOUSEKEEPING_VIEW_HISTORY: 'housekeeping.view_history',
  HOUSEKEEPING_MANAGE_CHECKLISTS: 'housekeeping.manage_checklists',
  HOUSEKEEPING_MANAGE_SUPPLIES: 'housekeeping.manage_supplies',
  HOUSEKEEPING_EXPORT: 'housekeeping.export',

  // =========================================================
  // MAINTENANCE
  // =========================================================

  MAINTENANCE_VIEW: 'maintenance.view',
  MAINTENANCE_CREATE: 'maintenance.create',
  MAINTENANCE_UPDATE: 'maintenance.update',
  MAINTENANCE_DELETE: 'maintenance.delete',
  MAINTENANCE_ASSIGN: 'maintenance.assign',
  MAINTENANCE_REASSIGN: 'maintenance.reassign',
  MAINTENANCE_START: 'maintenance.start',
  MAINTENANCE_PAUSE: 'maintenance.pause',
  MAINTENANCE_COMPLETE: 'maintenance.complete',
  MAINTENANCE_CANCEL: 'maintenance.cancel',
  MAINTENANCE_ADD_NOTE: 'maintenance.add_note',
  MAINTENANCE_ATTACH_FILE: 'maintenance.attach_file',
  MAINTENANCE_VIEW_HISTORY: 'maintenance.view_history',
  MAINTENANCE_EXPORT: 'maintenance.export',

  // =========================================================
  // FRONT DESK
  // =========================================================

  FRONT_DESK_VIEW: 'front_desk.view',
  FRONT_DESK_ARRIVALS: 'front_desk.arrivals',
  FRONT_DESK_DEPARTURES: 'front_desk.departures',
  FRONT_DESK_IN_HOUSE: 'front_desk.in_house',
  FRONT_DESK_WALK_INS: 'front_desk.walk_ins',
  FRONT_DESK_CREATE_RESERVATION: 'front_desk.create_reservation',
  FRONT_DESK_CHECK_IN: 'front_desk.check_in',
  FRONT_DESK_CHECK_OUT: 'front_desk.check_out',
  FRONT_DESK_EXTEND_STAY: 'front_desk.extend_stay',
  FRONT_DESK_CHANGE_ROOM: 'front_desk.change_room',
  FRONT_DESK_WAKE_UP_CALL: 'front_desk.wake_up_call',
  FRONT_DESK_GUEST_REQUESTS: 'front_desk.guest_requests',
  FRONT_DESK_PRINT_REGISTRATION: 'front_desk.print_registration',
  FRONT_DESK_PRINT_KEY_CARD: 'front_desk.print_key_card',

  // =========================================================
  // CHECK-IN / CHECK-OUT
  // =========================================================

  CHECKIN_VIEW: 'checkin.view',
  CHECKIN_PERFORM: 'checkin.perform',
  CHECKIN_OVERRIDE: 'checkin.override',
  CHECKIN_EARLY: 'checkin.early',
  CHECKIN_UPDATE_GUEST: 'checkin.update_guest',
  CHECKIN_ASSIGN_ROOM: 'checkin.assign_room',

  CHECKOUT_VIEW: 'checkout.view',
  CHECKOUT_PERFORM: 'checkout.perform',
  CHECKOUT_OVERRIDE: 'checkout.override',
  CHECKOUT_EARLY: 'checkout.early',
  CHECKOUT_LATE: 'checkout.late',
  CHECKOUT_EXTEND: 'checkout.extend',

  // =========================================================
  // FOLIOS
  // =========================================================

  FOLIOS_VIEW: 'folios.view',
  FOLIOS_CREATE: 'folios.create',
  FOLIOS_UPDATE: 'folios.update',
  FOLIOS_ADD_CHARGE: 'folios.add_charge',
  FOLIOS_REMOVE_CHARGE: 'folios.remove_charge',
  FOLIOS_ADJUST_CHARGE: 'folios.adjust_charge',
  FOLIOS_TRANSFER_CHARGE: 'folios.transfer_charge',
  FOLIOS_SPLIT: 'folios.split',
  FOLIOS_MERGE: 'folios.merge',
  FOLIOS_CLOSE: 'folios.close',
  FOLIOS_REOPEN: 'folios.reopen',
  FOLIOS_PRINT: 'folios.print',
  FOLIOS_EXPORT: 'folios.export',

  // =========================================================
  // ROOM CHARGES
  // =========================================================

  ROOM_CHARGES_VIEW: 'room_charges.view',
  ROOM_CHARGES_POST: 'room_charges.post',
  ROOM_CHARGES_UPDATE: 'room_charges.update',
  ROOM_CHARGES_VOID: 'room_charges.void',
  ROOM_CHARGES_ADJUST: 'room_charges.adjust',
  ROOM_CHARGES_TRANSFER: 'room_charges.transfer',

  // =========================================================
  // PAYMENTS
  // =========================================================

  PAYMENTS_VIEW: 'payments.view',
  PAYMENTS_CREATE: 'payments.create',
  PAYMENTS_COLLECT: 'payments.collect',
  PAYMENTS_UPDATE: 'payments.update',
  PAYMENTS_VOID: 'payments.void',
  PAYMENTS_REFUND: 'payments.refund',
  PAYMENTS_PARTIAL_REFUND: 'payments.partial_refund',
  PAYMENTS_REVERSE: 'payments.reverse',
  PAYMENTS_ALLOCATE: 'payments.allocate',
  PAYMENTS_UNALLOCATE: 'payments.unallocate',
  PAYMENTS_TRANSFER: 'payments.transfer',
  PAYMENTS_PRINT_RECEIPT: 'payments.print_receipt',
  PAYMENTS_EXPORT: 'payments.export',

  // =========================================================
  // INVOICES
  // =========================================================

  INVOICES_VIEW: 'invoices.view',
  INVOICES_CREATE: 'invoices.create',
  INVOICES_UPDATE: 'invoices.update',
  INVOICES_ISSUE: 'invoices.issue',
  INVOICES_VOID: 'invoices.void',
  INVOICES_CANCEL: 'invoices.cancel',
  INVOICES_MARK_PAID: 'invoices.mark_paid',
  INVOICES_SEND: 'invoices.send',
  INVOICES_PRINT: 'invoices.print',
  INVOICES_DOWNLOAD: 'invoices.download',
  INVOICES_EXPORT: 'invoices.export',

  // =========================================================
  // REFUNDS
  // =========================================================

  REFUNDS_VIEW: 'refunds.view',
  REFUNDS_CREATE: 'refunds.create',
  REFUNDS_APPROVE: 'refunds.approve',
  REFUNDS_REJECT: 'refunds.reject',
  REFUNDS_PROCESS: 'refunds.process',
  REFUNDS_CANCEL: 'refunds.cancel',
  REFUNDS_EXPORT: 'refunds.export',

  // =========================================================
  // CASHIER
  // =========================================================

  CASHIER_VIEW: 'cashier.view',
  CASHIER_OPEN_SHIFT: 'cashier.open_shift',
  CASHIER_CLOSE_SHIFT: 'cashier.close_shift',
  CASHIER_RECORD_CASH: 'cashier.record_cash',
  CASHIER_RECORD_CARD: 'cashier.record_card',
  CASHIER_RECORD_TRANSFER: 'cashier.record_transfer',
  CASHIER_RECORD_OTHER_PAYMENT: 'cashier.record_other_payment',
  CASHIER_CASH_DROP: 'cashier.cash_drop',
  CASHIER_CASH_PICKUP: 'cashier.cash_pickup',
  CASHIER_RECONCILE: 'cashier.reconcile',
  CASHIER_VIEW_TRANSACTIONS: 'cashier.view_transactions',
  CASHIER_PRINT_RECEIPT: 'cashier.print_receipt',

  // =========================================================
  // NIGHT AUDIT
  // =========================================================

  NIGHT_AUDIT_VIEW: 'night_audit.view',
  NIGHT_AUDIT_START: 'night_audit.start',
  NIGHT_AUDIT_RUN: 'night_audit.run',
  NIGHT_AUDIT_REVIEW: 'night_audit.review',
  NIGHT_AUDIT_COMPLETE: 'night_audit.complete',
  NIGHT_AUDIT_REOPEN: 'night_audit.reopen',
  NIGHT_AUDIT_ROLLBACK: 'night_audit.rollback',
  NIGHT_AUDIT_VIEW_REPORT: 'night_audit.view_report',
  NIGHT_AUDIT_EXPORT: 'night_audit.export',

  // =========================================================
  // REPORTS
  // =========================================================

  REPORTS_VIEW: 'reports.view',
  REPORTS_FINANCIAL_VIEW: 'reports.financial.view',
  REPORTS_FINANCIAL_EXPORT: 'reports.financial.export',

  REPORTS_REVENUE_VIEW: 'reports.revenue.view',
  REPORTS_REVENUE_EXPORT: 'reports.revenue.export',

  REPORTS_PAYMENT_VIEW: 'reports.payment.view',
  REPORTS_PAYMENT_EXPORT: 'reports.payment.export',

  REPORTS_TAX_VIEW: 'reports.tax.view',
  REPORTS_TAX_EXPORT: 'reports.tax.export',

  REPORTS_REFUND_VIEW: 'reports.refund.view',
  REPORTS_REFUND_EXPORT: 'reports.refund.export',

  REPORTS_FOLIO_VIEW: 'reports.folio.view',
  REPORTS_FOLIO_EXPORT: 'reports.folio.export',

  REPORTS_AR_VIEW: 'reports.accounts_receivable.view',
  REPORTS_AR_EXPORT: 'reports.accounts_receivable.export',

  REPORTS_OCCUPANCY_VIEW: 'reports.occupancy.view',
  REPORTS_OCCUPANCY_EXPORT: 'reports.occupancy.export',

  REPORTS_ARRIVALS_VIEW: 'reports.arrivals.view',
  REPORTS_ARRIVALS_EXPORT: 'reports.arrivals.export',

  REPORTS_DEPARTURES_VIEW: 'reports.departures.view',
  REPORTS_DEPARTURES_EXPORT: 'reports.departures.export',

  REPORTS_IN_HOUSE_VIEW: 'reports.in_house.view',
  REPORTS_IN_HOUSE_EXPORT: 'reports.in_house.export',

  REPORTS_NO_SHOW_VIEW: 'reports.no_show.view',
  REPORTS_NO_SHOW_EXPORT: 'reports.no_show.export',

  REPORTS_CANCELLATION_VIEW: 'reports.cancellation.view',
  REPORTS_CANCELLATION_EXPORT: 'reports.cancellation.export',

  REPORTS_ROOM_STATUS_VIEW: 'reports.room_status.view',
  REPORTS_ROOM_STATUS_EXPORT: 'reports.room_status.export',

  REPORTS_HOUSEKEEPING_VIEW: 'reports.housekeeping.view',
  REPORTS_HOUSEKEEPING_EXPORT: 'reports.housekeeping.export',

  REPORTS_MAINTENANCE_VIEW: 'reports.maintenance.view',
  REPORTS_MAINTENANCE_EXPORT: 'reports.maintenance.export',

  // =========================================================
  // RESTAURANT / F&B
  // =========================================================

  RESTAURANT_VIEW: 'restaurant.view',
  RESTAURANT_CREATE_ORDER: 'restaurant.create_order',
  RESTAURANT_UPDATE_ORDER: 'restaurant.update_order',
  RESTAURANT_CANCEL_ORDER: 'restaurant.cancel_order',
  RESTAURANT_VOID_ORDER: 'restaurant.void_order',
  RESTAURANT_ADD_ITEM: 'restaurant.add_item',
  RESTAURANT_REMOVE_ITEM: 'restaurant.remove_item',
  RESTAURANT_SEND_TO_KITCHEN: 'restaurant.send_to_kitchen',
  RESTAURANT_UPDATE_ORDER_STATUS: 'restaurant.update_order_status',
  RESTAURANT_CLOSE_ORDER: 'restaurant.close_order',
  RESTAURANT_TRANSFER_ORDER: 'restaurant.transfer_order',
  RESTAURANT_SPLIT_ORDER: 'restaurant.split_order',
  RESTAURANT_MERGE_ORDER: 'restaurant.merge_order',
  RESTAURANT_PRINT_ORDER: 'restaurant.print_order',
  RESTAURANT_PRINT_RECEIPT: 'restaurant.print_receipt',

  RESTAURANT_TABLES_VIEW: 'restaurant.tables.view',
  RESTAURANT_TABLES_CREATE: 'restaurant.tables.create',
  RESTAURANT_TABLES_UPDATE: 'restaurant.tables.update',
  RESTAURANT_TABLES_DELETE: 'restaurant.tables.delete',
  RESTAURANT_TABLES_ASSIGN: 'restaurant.tables.assign',
  RESTAURANT_TABLES_MOVE: 'restaurant.tables.move',
  RESTAURANT_TABLES_MERGE: 'restaurant.tables.merge',

  RESTAURANT_MENU_VIEW: 'restaurant.menu.view',
  RESTAURANT_MENU_CREATE: 'restaurant.menu.create',
  RESTAURANT_MENU_UPDATE: 'restaurant.menu.update',
  RESTAURANT_MENU_DELETE: 'restaurant.menu.delete',
  RESTAURANT_MENU_PUBLISH: 'restaurant.menu.publish',
  RESTAURANT_MENU_UNPUBLISH: 'restaurant.menu.unpublish',
  RESTAURANT_MENU_MANAGE_CATEGORIES: 'restaurant.menu.manage_categories',
  RESTAURANT_MENU_MANAGE_PRICES: 'restaurant.menu.manage_prices',

  // =========================================================
  // SERVICES
  // =========================================================

  SERVICES_VIEW: 'services.view',
  SERVICES_CREATE: 'services.create',
  SERVICES_UPDATE: 'services.update',
  SERVICES_DELETE: 'services.delete',
  SERVICES_ASSIGN: 'services.assign',
  SERVICES_COMPLETE: 'services.complete',
  SERVICES_CANCEL: 'services.cancel',
  SERVICES_POST_CHARGE: 'services.post_charge',
  SERVICES_VOID_CHARGE: 'services.void_charge',
  SERVICES_EXPORT: 'services.export',

  // =========================================================
  // GUEST REQUESTS
  // =========================================================

  GUEST_REQUESTS_VIEW: 'guest_requests.view',
  GUEST_REQUESTS_CREATE: 'guest_requests.create',
  GUEST_REQUESTS_UPDATE: 'guest_requests.update',
  GUEST_REQUESTS_ASSIGN: 'guest_requests.assign',
  GUEST_REQUESTS_REASSIGN: 'guest_requests.reassign',
  GUEST_REQUESTS_START: 'guest_requests.start',
  GUEST_REQUESTS_COMPLETE: 'guest_requests.complete',
  GUEST_REQUESTS_CANCEL: 'guest_requests.cancel',
  GUEST_REQUESTS_ESCALATE: 'guest_requests.escalate',
  GUEST_REQUESTS_EXPORT: 'guest_requests.export',

  // =========================================================
  // REVIEWS
  // =========================================================

  REVIEWS_VIEW: 'reviews.view',
  REVIEWS_CREATE: 'reviews.create',
  REVIEWS_UPDATE: 'reviews.update',
  REVIEWS_RESPOND: 'reviews.respond',
  REVIEWS_PUBLISH: 'reviews.publish',
  REVIEWS_HIDE: 'reviews.hide',
  REVIEWS_DELETE: 'reviews.delete',
  REVIEWS_EXPORT: 'reviews.export',

  // =========================================================
  // PROMOTIONS
  // =========================================================

  PROMOTIONS_VIEW: 'promotions.view',
  PROMOTIONS_CREATE: 'promotions.create',
  PROMOTIONS_UPDATE: 'promotions.update',
  PROMOTIONS_DELETE: 'promotions.delete',
  PROMOTIONS_ACTIVATE: 'promotions.activate',
  PROMOTIONS_DEACTIVATE: 'promotions.deactivate',
  PROMOTIONS_CONFIGURE_DISCOUNT: 'promotions.configure_discount',
  PROMOTIONS_CONFIGURE_DATES: 'promotions.configure_dates',
  PROMOTIONS_CONFIGURE_RESTRICTIONS: 'promotions.configure_restrictions',

  // =========================================================
  // BOOKING ENGINE
  // =========================================================

  BOOKING_ENGINE_VIEW: 'booking_engine.view',
  BOOKING_ENGINE_CONFIGURE: 'booking_engine.configure',
  BOOKING_ENGINE_MANAGE_AVAILABILITY: 'booking_engine.manage_availability',
  BOOKING_ENGINE_MANAGE_RATES: 'booking_engine.manage_rates',
  BOOKING_ENGINE_MANAGE_CONTENT: 'booking_engine.manage_content',
  BOOKING_ENGINE_MANAGE_PAGES: 'booking_engine.manage_pages',
  BOOKING_ENGINE_MANAGE_IMAGES: 'booking_engine.manage_images',
  BOOKING_ENGINE_MANAGE_AMENITIES: 'booking_engine.manage_amenities',
  BOOKING_ENGINE_VIEW_BOOKINGS: 'booking_engine.view_bookings',
  BOOKING_ENGINE_EXPORT: 'booking_engine.export',

  // =========================================================
  // CHANNELS / OTA
  // =========================================================

  CHANNELS_VIEW: 'channels.view',
  CHANNELS_CONNECT: 'channels.connect',
  CHANNELS_DISCONNECT: 'channels.disconnect',
  CHANNELS_CONFIGURE: 'channels.configure',
  CHANNELS_SYNC: 'channels.sync',
  CHANNELS_SYNC_RATES: 'channels.sync_rates',
  CHANNELS_SYNC_AVAILABILITY: 'channels.sync_availability',
  CHANNELS_SYNC_RESERVATIONS: 'channels.sync_reservations',
  CHANNELS_VIEW_LOGS: 'channels.view_logs',
  CHANNELS_RETRY_SYNC: 'channels.retry_sync',

  // =========================================================
  // DOOR ACCESS
  // =========================================================

  DOOR_ACCESS_VIEW: 'door_access.view',
  DOOR_ACCESS_CREATE: 'door_access.create',
  DOOR_ACCESS_UPDATE: 'door_access.update',
  DOOR_ACCESS_REVOKE: 'door_access.revoke',
  DOOR_ACCESS_GENERATE_PIN: 'door_access.generate_pin',
  DOOR_ACCESS_GENERATE_EKEY: 'door_access.generate_ekey',
  DOOR_ACCESS_ISSUE_CARD: 'door_access.issue_card',
  DOOR_ACCESS_REVOKE_CARD: 'door_access.revoke_card',
  DOOR_ACCESS_UNLOCK: 'door_access.unlock',
  DOOR_ACCESS_LOCK: 'door_access.lock',
  DOOR_ACCESS_VIEW_LOGS: 'door_access.view_logs',
  DOOR_ACCESS_EXPORT: 'door_access.export',

  // =========================================================
  // USERS
  // =========================================================

  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_UPDATE: 'users.update',
  USERS_ACTIVATE: 'users.activate',
  USERS_DEACTIVATE: 'users.deactivate',
  USERS_DELETE: 'users.delete',
  USERS_RESET_PASSWORD: 'users.reset_password',
  USERS_RESET_MFA: 'users.reset_mfa',
  USERS_VIEW_ACTIVITY: 'users.view_activity',
  USERS_EXPORT: 'users.export',

  // =========================================================
  // ROLES
  // =========================================================

  ROLES_VIEW: 'roles.view',
  ROLES_CREATE: 'roles.create',
  ROLES_UPDATE: 'roles.update',
  ROLES_DELETE: 'roles.delete',
  ROLES_ASSIGN: 'roles.assign',
  ROLES_UNASSIGN: 'roles.unassign',
  ROLES_CLONE: 'roles.clone',

  // =========================================================
  // PERMISSIONS
  // =========================================================

  PERMISSIONS_VIEW: 'permissions.view',
  PERMISSIONS_ASSIGN: 'permissions.assign',
  PERMISSIONS_REVOKE: 'permissions.revoke',

  // =========================================================
  // DEPARTMENTS
  // =========================================================

  DEPARTMENTS_VIEW: 'departments.view',
  DEPARTMENTS_CREATE: 'departments.create',
  DEPARTMENTS_UPDATE: 'departments.update',
  DEPARTMENTS_DELETE: 'departments.delete',
  DEPARTMENTS_ASSIGN_STAFF: 'departments.assign_staff',

  // =========================================================
  // SETTINGS
  // =========================================================

  SETTINGS_VIEW: 'settings.view',
  SETTINGS_UPDATE: 'settings.update',
  SETTINGS_HOTEL: 'settings.hotel',
  SETTINGS_ROOMS: 'settings.rooms',
  SETTINGS_RATES: 'settings.rates',
  SETTINGS_TAXES: 'settings.taxes',
  SETTINGS_PAYMENTS: 'settings.payments',
  SETTINGS_NOTIFICATIONS: 'settings.notifications',
  SETTINGS_EMAIL: 'settings.email',
  SETTINGS_SMS: 'settings.sms',
  SETTINGS_BOOKING_ENGINE: 'settings.booking_engine',
  SETTINGS_INTEGRATIONS: 'settings.integrations',

  // =========================================================
  // TAXES
  // =========================================================

  TAXES_VIEW: 'taxes.view',
  TAXES_CREATE: 'taxes.create',
  TAXES_UPDATE: 'taxes.update',
  TAXES_DELETE: 'taxes.delete',
  TAXES_ACTIVATE: 'taxes.activate',
  TAXES_DEACTIVATE: 'taxes.deactivate',

  // =========================================================
  // AUDIT LOGS
  // =========================================================

  AUDIT_LOGS_VIEW: 'audit_logs.view',
  AUDIT_LOGS_EXPORT: 'audit_logs.export',
  AUDIT_LOGS_VIEW_SENSITIVE: 'audit_logs.view_sensitive',

  // =========================================================
  // COMMUNICATIONS
  // =========================================================

  COMMUNICATIONS_VIEW: 'communications.view',
  COMMUNICATIONS_SEND_EMAIL: 'communications.send_email',
  COMMUNICATIONS_SEND_SMS: 'communications.send_sms',
  COMMUNICATIONS_SEND_WHATSAPP: 'communications.send_whatsapp',
  COMMUNICATIONS_MANAGE_TEMPLATES: 'communications.manage_templates',
  COMMUNICATIONS_MANAGE_CAMPAIGNS: 'communications.manage_campaigns',
  COMMUNICATIONS_VIEW_LOGS: 'communications.view_logs',

  // =========================================================
  // INVENTORY
  // =========================================================

  INVENTORY_VIEW: 'inventory.view',
  INVENTORY_CREATE: 'inventory.create',
  INVENTORY_UPDATE: 'inventory.update',
  INVENTORY_DELETE: 'inventory.delete',
  INVENTORY_ADJUST: 'inventory.adjust',
  INVENTORY_TRANSFER: 'inventory.transfer',
  INVENTORY_RECEIVE: 'inventory.receive',
  INVENTORY_ISSUE: 'inventory.issue',
  INVENTORY_STOCKTAKE: 'inventory.stocktake',
  INVENTORY_EXPORT: 'inventory.export',

  // =========================================================
  // SUPPLIERS / PURCHASE ORDERS
  // =========================================================

  SUPPLIERS_VIEW: 'suppliers.view',
  SUPPLIERS_CREATE: 'suppliers.create',
  SUPPLIERS_UPDATE: 'suppliers.update',
  SUPPLIERS_DELETE: 'suppliers.delete',

  PURCHASE_ORDERS_VIEW: 'purchase_orders.view',
  PURCHASE_ORDERS_CREATE: 'purchase_orders.create',
  PURCHASE_ORDERS_UPDATE: 'purchase_orders.update',
  PURCHASE_ORDERS_APPROVE: 'purchase_orders.approve',
  PURCHASE_ORDERS_CANCEL: 'purchase_orders.cancel',
  PURCHASE_ORDERS_RECEIVE: 'purchase_orders.receive',
  PURCHASE_ORDERS_EXPORT: 'purchase_orders.export',

  // =========================================================
  // EXPORTS
  // =========================================================

  EXPORTS_CREATE: 'exports.create',
  EXPORTS_VIEW: 'exports.view',
  EXPORTS_DOWNLOAD: 'exports.download',
  EXPORTS_DELETE: 'exports.delete',

  // =========================================================
  // INTEGRATIONS
  // =========================================================

  INTEGRATIONS_VIEW: 'integrations.view',
  INTEGRATIONS_CONNECT: 'integrations.connect',
  INTEGRATIONS_DISCONNECT: 'integrations.disconnect',
  INTEGRATIONS_CONFIGURE: 'integrations.configure',
  INTEGRATIONS_TEST: 'integrations.test',
  INTEGRATIONS_SYNC: 'integrations.sync',
  INTEGRATIONS_VIEW_LOGS: 'integrations.view_logs',

  // =========================================================
  // API / WEBHOOKS
  // =========================================================

  API_KEYS_VIEW: 'api_keys.view',
  API_KEYS_CREATE: 'api_keys.create',
  API_KEYS_ROTATE: 'api_keys.rotate',
  API_KEYS_REVOKE: 'api_keys.revoke',

  WEBHOOKS_VIEW: 'webhooks.view',
  WEBHOOKS_CREATE: 'webhooks.create',
  WEBHOOKS_UPDATE: 'webhooks.update',
  WEBHOOKS_DELETE: 'webhooks.delete',
  WEBHOOKS_TEST: 'webhooks.test',
} as const;

export type PermissionName =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS] | '*';
