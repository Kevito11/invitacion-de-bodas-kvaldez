import React, { createContext, useContext, useState, type ReactNode } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    t: (key: string) => string;
    isMobileSimulation: boolean;
    toggleMobileSimulation: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations: Record<Language, Record<string, string>> = {
    es: {
        // Nav & Sidebar
        'nav.explore': 'EXPLORAR DISEÑOS',
        'nav.dashboard': 'MIS EVENTOS',
        'nav.home': 'INICIO', // Added
        'nav.messages': 'MENSAJES', // Added
        'nav.directory': 'DIRECTORIO', // Added
        'nav.received': 'RECIBIDOS', // Added
        'nav.guests': 'INVITADOS',
        'nav.settings': 'CONFIGURACIÓN',
        'nav.help': 'AYUDA',
        'nav.my_account': 'MI CUENTA',
        'profile.my_account': 'MI CUENTA', // Added alias
        'nav.new_event': 'NUEVO EVENTO',
        'nav.new': 'NUEVO', // Added alias
        'nav.logout': 'Cerrar Sesión',
        'nav.mobile_version': 'VERSIÓN MÓVIL',
        'nav.desktop_version': 'VERSIÓN ESCRITORIO',
        'nav.language': 'IDIOMA',
        'nav.my_events': 'MIS EVENTOS', // Added alias
        'nav.no_events': 'No tienes eventos aún', // Added

        // Dashboard
        'dashboard.title': 'Mis Eventos',
        'dashboard.subtitle': 'Gestiona tus diseños y lista de invitados.',
        'dashboard.create_new': 'Crear Nuevo',
        'dashboard.search_placeholder': 'Buscar eventos',
        'dashboard.filter.active': 'Activo',
        'dashboard.filter.archived': 'Archivado',
        'dashboard.filter.all_tags': 'Todas las etiquetas',
        'dashboard.filter.clear': 'Limpiar filtros',
        'dashboard.delete_selected': 'Eliminar',
        'dashboard.table.header.title': 'Título del envío',
        'dashboard.table.header.created': 'Creado el',
        'dashboard.table.header.event_date': 'Fecha del evento',
        'dashboard.table.header.last_delivery': 'Última entrega',
        'dashboard.table.header.open_rate': 'Tasa de apertura',
        'dashboard.table.header.response_rate': 'Tasa de respuesta',
        'dashboard.table.header.status': 'Estado',
        'dashboard.table.status.purchased': 'Comprado',
        'dashboard.table.status.trial': 'Modo de prueba',
        'dashboard.table.no_events': 'No tienes eventos activos en esta vista.',
        'dashboard.table.no_results': 'No se encontraron eventos con estos filtros.',
        'dashboard.table.view_details': 'Ver Detalles',
        'dashboard.table.not_sent': 'Sin enviar',
        'dashboard.table.event_type': 'Invitación + Confirmación',
        'dashboard.table.no_tag': 'Sin Etiqueta',
        'dashboard.table.add_tag': 'Etiqueta',

        // Event Details
        'event.manage_tags': 'Gestionar Etiquetas',
        'event.tag': 'Etiqueta',
        'event.new_tag': '+ Etiqueta',
        'event.create_tag_label': 'Crear nueva etiqueta:',
        'event.select_label': 'Seleccionar:',
        'event.no_tags': 'No hay etiquetas aún',
        'event.work_on_invitation': 'TRABAJAR EN INVITACIÓN',
        'event.saved_changes': 'Cambios guardados',
        'event.current_plan': 'Plan Actual',
        'event.people': 'personas',
        'event.view_rates': 'VER TARIFAS',
        'event.preview': 'Vista Previa',
        'event.edit_design': 'Editar Diseño',
        'event.selected_design': 'DISEÑO SELECCIONADO',
        'event.custom': 'Personalizado',
        'event.download': 'DESCARGAR',
        'event.clone': 'CLONAR',
        'event.archive': 'ARCHIVAR',
        'event.details': 'Detalles del Evento',
        'event.delivery': 'Entrega',
        'event.delivery_page': 'IR A ENTREGA',
        'event.open_rate': 'Tasa de Apertura',
        'event.delivery_optimizer': 'Optimizador de Entregas',
        'event.opened': 'Abiertos',
        'event.responded': 'Respondidos',
        'event.add_more_recipients': '+ Agregar más destinatarios',
        'event.tracking': 'Seguimiento',
        'event.tracking_page': 'IR A SEGUIMIENTO',
        'event.response_rate': 'Tasa de Respuesta',
        'event.deadline': 'Fecha límite',
        'event.attending': 'Asistirán',
        'event.not_attending': 'No Asistirán',
        'event.pending': 'Pendientes',
        'event.view_all_confirmations': 'Ver todas las confirmaciones',
        'event.send_group_email': 'Enviar email al grupo',
        'event.manage_reminders': 'Gestionar recordatorios',

        // Editor / Workspace
        'editor.back_dashboard': 'Salir al Dashboard',
        'editor.invitation_label': 'INVITACIÓN',
        'editor.step.design': 'DISEÑO',
        'editor.step.details': 'DETALLES',
        'editor.step.preview': 'PREVISUALIZACIÓN',
        'editor.step.delivery': 'ENTREGA',
        'editor.step.tracking': 'SEGUIMIENTO',
        'editor.saved': 'Guardado',
        'editor.saving': 'Guardando...',
        'editor.next': 'SIGUIENTE',

        // Step: Design
        'design.tab.card': 'Editar tarjeta',
        'design.tab.envelope': 'Editar sobre',
        'design.warning': 'Cualquier cambio que realice actualizará la tarjeta automáticamente para todos los destinatarios.',
        'design.view.desktop': 'Desktop',
        'design.view.mobile': 'Mobile',
        'design.tool.presets': 'Plantillas',
        'design.tool.layout': 'Estructura',
        'design.tool.content': 'Contenido',
        'design.tool.typography': 'Tipografía',
        'design.tool.image': 'Agregar imagen',
        'design.tool.styles': 'Estilos',
        'design.tool.shape': 'Forma',
        'design.tool.experience': 'Experiencia',
        'design.tool.material': 'Material',
        'design.tool.color': 'Color',
        'design.tool.liner': 'Forro',
        'design.tool.seal': 'Sello',
        'design.tool.stamp': 'Estampilla',
        'design.tool.finish': 'Acabado',
        'design.tutorial.title': 'Guía Rápida de Diseño',
        'design.tutorial.intro': 'Sigue estos pasos para crear tu invitación perfecta:',
        'design.tutorial.step1': 'Detalles Básicos: Usa la barra izquierda "Agregar texto" para editar nombres.',
        'design.tutorial.step2': 'Imágenes: Sube fotos de la pareja desde "Agregar imagen".',
        'design.tutorial.step3': 'Estilo: Selecciona "Estilos" para probar diferentes paletas.',
        'design.tutorial.step4': 'Sobre: Cambia a la pestaña "Editar sobre" para personalizar.',
        'design.tutorial.step5': 'Vista Previa: Alterna entre móvil y escritorio.',
        'design.tutorial.ok': 'Entendido',
        // Design Panel Details
        'design.panel.presets.title': 'Plantillas de Diseño',
        'design.panel.presets.desc': 'Elige un diseño base para comenzar.',
        'design.panel.envelope_style.title': '¿Cómo quieres que se abra tu invitación?',
        'design.panel.envelope_style.3d': 'Sobre 3D (Clásico)',
        'design.panel.envelope_style.book': 'Libro / Díptico',
        'design.panel.envelope_style.crumple': 'Papel Arrugado (Artístico)',
        'design.panel.liner.title': 'Personaliza el interior del sobre.',
        'design.panel.liner.solid': 'Color Sólido',
        'design.panel.liner.pattern': 'Patrones Prediseñados',
        'design.panel.liner.image': 'Imagen / Patrón',
        'design.panel.seal.enable': 'Habilitar Sello de Cera',
        'design.panel.seal.color': 'Color de Cera',
        'design.panel.seal.initials': 'Iniciales / Texto',

        // Envelope Options (Added)
        'design.option.classic': 'Clásico',
        'design.option.pointed': 'Puntiagudo',
        'design.option.square': 'Cuadrado',
        'design.option.rounded': 'Redondeado',
        'design.material.matte': 'Mate',
        'design.material.linen': 'Lino',
        'design.material.velvet': 'Terciopelo',
        'design.material.cardstock': 'Cartulina',
        'design.finish.matte': 'Mate',
        'design.finish.glossy': 'Brillante',
        'design.finish.metallic': 'Metálico',
        'design.pattern.none': 'Sin Patrón',
        'design.pattern.marble': 'Mármol',
        'design.pattern.floral': 'Floral Vintage',
        'design.pattern.geo': 'Geométrico',
        'design.pattern.gold': 'Polvo Dorado',

        // Step: Details
        'details.title': 'Detalles del Evento',
        'details.label.p1': 'Novio/a 1',
        'details.label.p2': 'Novio/a 2',
        'details.label.date': 'Fecha',
        'details.label.time': 'Hora (Reloj)',
        'details.label.venue': 'Lugar del Evento',
        'details.placeholder.venue_name': 'Nombre del Salón / Iglesia',
        'details.placeholder.venue_address': 'Dirección completa',
        'details.label.message': 'Mensaje de Bienvenida',
        'details.placeholder.message': 'Escribe un mensaje bonito para tus invitados...',
        'details.label.dresscode': 'Código de Vestimenta',
        'details.placeholder.dresscode_details': 'Detalles adicionales (opcional)',
        'details.option.select': 'Selecciona una opción',
        'details.placeholder.name': 'Nombre',
        // Dress Codes (Added)
        'dresscode.formal.label': 'Formal',
        'dresscode.formal.desc': 'Traje oscuro y corbata para ellos, vestido largo o de noche para ellas.',
        'dresscode.semiformal.label': 'Semi-Formal',
        'dresscode.semiformal.desc': 'Traje sin corbata o pantalón de vestir y camisa. Vestido cóctel o traje sastre.',
        'dresscode.cocktail.label': 'Coctel / Casual',
        'dresscode.cocktail.desc': 'Vestimenta relajada pero elegante. Guayaberas, camisas de lino, vestidos cortos o faldas.',
        'dresscode.rigurosa.label': 'Etiqueta Rigurosa',
        'dresscode.rigurosa.desc': 'Frac o esmoquin para ellos. Vestido largo de gala para ellas.',
        'dresscode.playa.label': 'Playa / Guayabera',
        'dresscode.playa.desc': 'Ropa fresca, colores claros, lino. Guayaberas y vestidos vaporosos. Sin tacones aguja.',

        // Step: Guests
        'guests.title': 'Lista de Invitados',
        'guests.desc': 'Gestiona quiénes asistirán a tu evento. Puedes crear grupos familiares.',
        // Assuming GuestManager has internal translations or needs them passed. 
        // For now, these are the main page headers.

        // Step: Send
        'send.title': 'Enviar Invitación',
        'send.ready.title': '¡Todo listo!',
        'send.ready.desc': 'Tu invitación está configurada. Genera tu enlace único para compartirlo.',
        'send.btn.generate': 'Generar Enlace Oficial',
        'send.btn.generating': 'Generando...',
        'send.btn.copy': 'Copiar',
        'send.btn.open': 'Abrir',
        'send.btn.share_whatsapp': 'Compartir en WhatsApp',
        'send.stat.total': 'Total Invitados',
        'send.stat.confirmed': 'Confirmados',
        'send.stat.pending': 'Pendientes',

        // Auth
        'auth.login.title': 'Acceso Administrativo',
        'auth.login.user': 'Usuario',
        'auth.login.pass': 'Contraseña',
        'auth.login.btn': 'Entrar',
        'auth.login.error': 'Credenciales incorrectas. Intenta de nuevo.',
        'auth.login.footer': 'Acceso exclusivo para administradores.',

        // Footer (Added)
        'footer.mode_day': 'Modo Día',
        'footer.mode_night': 'Modo Noche',
        'footer.lang_es': 'ESPAÑOL',
        'footer.lang_en': 'ENGLISH',
        'footer.mobile_version': 'VERSIÓN MÓVIL',
        'footer.desktop_version': 'VERSIÓN ESCRITORIO',
        'footer.logout': 'Cerrar Sesión',
    },
    en: {
        // Nav & Sidebar
        'nav.explore': 'EXPLORE DESIGNS',
        'nav.dashboard': 'MY EVENTS',
        'nav.home': 'HOME', // Added
        'nav.messages': 'MESSAGES', // Added
        'nav.directory': 'DIRECTORY', // Added
        'nav.received': 'RECEIVED', // Added
        'nav.guests': 'GUESTS',
        'nav.settings': 'SETTINGS',
        'nav.help': 'HELP',
        'nav.my_account': 'MY ACCOUNT',
        'profile.my_account': 'MY ACCOUNT', // Added alias
        'nav.new_event': 'NEW EVENT',
        'nav.new': 'NEW', // Added alias
        'nav.logout': 'Log Out',
        'nav.mobile_version': 'MOBILE VERSION',
        'nav.desktop_version': 'DESKTOP VERSION',
        'nav.language': 'LANGUAGE',
        'nav.my_events': 'MY EVENTS', // Added alias
        'nav.no_events': 'No events yet', // Added

        // Dashboard
        'dashboard.title': 'My Events',
        'dashboard.subtitle': 'Manage your designs and guest list.',
        'dashboard.create_new': 'Create New',
        'dashboard.search_placeholder': 'Search events',
        'dashboard.filter.active': 'Active',
        'dashboard.filter.archived': 'Archived',
        'dashboard.filter.all_tags': 'All Tags',
        'dashboard.filter.clear': 'Clear filters',
        'dashboard.delete_selected': 'Delete',
        'dashboard.table.header.title': 'Event Title',
        'dashboard.table.header.created': 'Created on',
        'dashboard.table.header.event_date': 'Event Date',
        'dashboard.table.header.last_delivery': 'Last Delivery',
        'dashboard.table.header.open_rate': 'Open Rate',
        'dashboard.table.header.response_rate': 'Response Rate',
        'dashboard.table.header.status': 'Status',
        'dashboard.table.status.purchased': 'Purchased',
        'dashboard.table.status.trial': 'Trial Mode',
        'dashboard.table.no_events': 'You have no active events in this view.',
        'dashboard.table.no_results': 'No events found with these filters.',
        'dashboard.table.view_details': 'View Details',
        'dashboard.table.not_sent': 'Not sent',
        'dashboard.table.event_type': 'Invitation + RSVP',
        'dashboard.table.no_tag': 'No Tag',
        'dashboard.table.add_tag': 'Tag',

        // Event Details
        'event.manage_tags': 'Manage Tags',
        'event.tag': 'Tag',
        'event.new_tag': '+ Tag',
        'event.create_tag_label': 'Create new tag:',
        'event.select_label': 'Select:',
        'event.no_tags': 'No tags yet',
        'event.work_on_invitation': 'EDIT INVITATION',
        'event.saved_changes': 'Changes saved',
        'event.current_plan': 'Current Plan',
        'event.people': 'people',
        'event.view_rates': 'VIEW RATES',
        'event.preview': 'Preview',
        'event.edit_design': 'Edit Design',
        'event.selected_design': 'SELECTED DESIGN',
        'event.custom': 'Custom',
        'event.download': 'DOWNLOAD',
        'event.clone': 'CLONE',
        'event.archive': 'ARCHIVE',
        'event.details': 'Event Details',
        'event.delivery': 'Delivery',
        'event.delivery_page': 'GO TO DELIVERY',
        'event.open_rate': 'Open Rate',
        'event.delivery_optimizer': 'Delivery Optimizer',
        'event.opened': 'Opened',
        'event.responded': 'Responded',
        'event.add_more_recipients': '+ Add more recipients',
        'event.tracking': 'Tracking',
        'event.tracking_page': 'GO TO TRACKING',
        'event.response_rate': 'Response Rate',
        'event.deadline': 'Deadline',
        'event.attending': 'Attending',
        'event.not_attending': 'Not Attending',
        'event.pending': 'Pending',
        'event.view_all_confirmations': 'View all confirmations',
        'event.send_group_email': 'Send group email',
        'event.manage_reminders': 'Manage reminders',

        // Editor / Workspace
        'editor.back_dashboard': 'Back to Dashboard',
        'editor.invitation_label': 'INVITATION',
        'editor.step.design': 'DESIGN',
        'editor.step.details': 'DETAILS',
        'editor.step.preview': 'PREVIEW',
        'editor.step.delivery': 'DELIVERY',
        'editor.step.tracking': 'TRACKING',
        'editor.saved': 'Saved',
        'editor.saving': 'Saving...',
        'editor.next': 'NEXT',

        // Step: Design
        'design.tab.card': 'Edit Card',
        'design.tab.envelope': 'Edit Envelope',
        'design.warning': 'Any changes you make will automatically update the card for all recipients.',
        'design.view.desktop': 'Desktop',
        'design.view.mobile': 'Mobile',
        'design.tool.presets': 'Templates',
        'design.tool.layout': 'Structure',
        'design.tool.content': 'Content',
        'design.tool.typography': 'Typography',
        'design.tool.image': 'Add Image',
        'design.tool.styles': 'Styles',
        'design.tool.shape': 'Shape',
        'design.tool.experience': 'Experience',
        'design.tool.material': 'Material',
        'design.tool.color': 'Color',
        'design.tool.liner': 'Liner',
        'design.tool.seal': 'Seal',
        'design.tool.stamp': 'Stamp',
        'design.tool.finish': 'Finish',
        'design.tutorial.title': 'Quick Design Guide',
        'design.tutorial.intro': 'Follow these steps to create your perfect invitation:',
        'design.tutorial.step1': 'Basic Details: Use the "Content" tool to edit names.',
        'design.tutorial.step2': 'Images: Upload couple photos from "Add Image".',
        'design.tutorial.step3': 'Style: Select "Styles" to test different palettes.',
        'design.tutorial.step4': 'Envelope: Switch to "Edit Envelope" tab to customize.',
        'design.tutorial.step5': 'Preview: Toggle between mobile and desktop views.',
        'design.tutorial.ok': 'Got it',
        // Design Panel Details
        'design.panel.presets.title': 'Design Templates',
        'design.panel.presets.desc': 'Choose a base design to start.',
        'design.panel.envelope_style.title': 'How should your invitation open?',
        'design.panel.envelope_style.3d': '3D Envelope (Classic)',
        'design.panel.envelope_style.book': 'Book / Diptych',
        'design.panel.envelope_style.crumple': 'Crumpled Paper (Artistic)',
        'design.panel.liner.title': 'Customize the envelope interior.',
        'design.panel.liner.solid': 'Solid Color',
        'design.panel.liner.pattern': 'Preset Patterns',
        'design.panel.liner.image': 'Image / Pattern',
        'design.panel.seal.enable': 'Enable Wax Seal',
        'design.panel.seal.color': 'Wax Color',
        'design.panel.seal.initials': 'Initials / Text',

        // Envelope Options (Added)
        'design.option.classic': 'Classic',
        'design.option.pointed': 'Pointed',
        'design.option.square': 'Square',
        'design.option.rounded': 'Rounded',
        'design.material.matte': 'Matte',
        'design.material.linen': 'Linen',
        'design.material.velvet': 'Velvet',
        'design.material.cardstock': 'Cardstock',
        'design.finish.matte': 'Matte',
        'design.finish.glossy': 'Glossy',
        'design.finish.metallic': 'Metallic',
        'design.pattern.none': 'No Pattern',
        'design.pattern.marble': 'Marble',
        'design.pattern.floral': 'Vintage Floral',
        'design.pattern.geo': 'Geometric',
        'design.pattern.gold': 'Gold Dust',

        // Step: Details
        'details.title': 'Event Details',
        'details.label.p1': 'Partner 1',
        'details.label.p2': 'Partner 2',
        'details.label.date': 'Date',
        'details.label.time': 'Time (Clock)',
        'details.label.venue': 'Event Venue',
        'details.placeholder.venue_name': 'Venue Name / Church',
        'details.placeholder.venue_address': 'Full Address',
        'details.label.message': 'Welcome Message',
        'details.placeholder.message': 'Write a nice message for your guests...',
        'details.label.dresscode': 'Dress Code',
        'details.placeholder.dresscode_details': 'Additional details (optional)',
        'details.option.select': 'Select an option',
        'details.placeholder.name': 'Name',
        // Dress Codes (Added)
        'dresscode.formal.label': 'Formal',
        'dresscode.formal.desc': 'Dark suit and tie for men, long or evening dress for women.',
        'dresscode.semiformal.label': 'Semi-Formal',
        'dresscode.semiformal.desc': 'Suit without tie or dress pants and shirt. Cocktail dress or suit.',
        'dresscode.cocktail.label': 'Cocktail / Casual',
        'dresscode.cocktail.desc': 'Relaxed but elegant. Guayaberas, linen shirts, short dresses or skirts.',
        'dresscode.rigurosa.label': 'Black Tie',
        'dresscode.rigurosa.desc': 'Tuxedo for men. Long gala dress for women.',
        'dresscode.playa.label': 'Beach / Guayabera',
        'dresscode.playa.desc': 'Fresh clothes, light colors, linen. Guayaberas and flowing dresses. No stiletto heels.',

        // Step: Guests
        'guests.title': 'Guest List',
        'guests.desc': 'Manage who will attend your event. You can create family groups.',

        // Step: Send
        'send.title': 'Send Invitation',
        'send.ready.title': 'All Set!',
        'send.ready.desc': 'Your invitation is configured. Generate your unique link to share.',
        'send.btn.generate': 'Generate Official Link',
        'send.btn.generating': 'Generating...',
        'send.btn.copy': 'Copy',
        'send.btn.open': 'Open',
        'send.btn.share_whatsapp': 'Share on WhatsApp',
        'send.stat.total': 'Total Guests',
        'send.stat.confirmed': 'Confirmed',
        'send.stat.pending': 'Pending',

        // Auth
        'auth.login.title': 'Admin Access',
        'auth.login.user': 'Username',
        'auth.login.pass': 'Password',
        'auth.login.btn': 'Login',
        'auth.login.error': 'Incorrect credentials. Try again.',
        'auth.login.footer': 'Exclusive access for administrators.',

        // Footer (Added)
        'footer.mode_day': 'Day Mode',
        'footer.mode_night': 'Night Mode',
        'footer.lang_es': 'ESPAÑOL',
        'footer.lang_en': 'ENGLISH',
        'footer.mobile_version': 'MOBILE VERSION',
        'footer.desktop_version': 'DESKTOP VERSION',
        'footer.logout': 'Log Out',
    }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('es');
    const [isMobileSimulation, setIsMobileSimulation] = useState(false);

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'es' ? 'en' : 'es');
    };

    const toggleMobileSimulation = () => {
        setIsMobileSimulation(prev => !prev);
    };

    const t = (key: string) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t, isMobileSimulation, toggleMobileSimulation }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
