/**
 * Create Event Page
 * 
 * Event creation form with:
 * - Multi-step form with animations
 * - Image upload preview
 * - Date/time picker styling
 * - Form validation
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiCalendar, FiMapPin, FiDollarSign, FiUsers,
    FiImage, FiArrowRight, FiArrowLeft, FiCheck
} from 'react-icons/fi';
import { AnimatedPage } from '../components/animations/PageTransition';
import AnimatedInput from '../components/ui/AnimatedInput';
import AnimatedButton from '../components/ui/AnimatedButton';
import { useToast } from '../components/ui/Toast';
import './CreateEvent.css';

// Form steps
const steps = [
    { id: 1, title: 'Basic Info', description: 'Event name and description' },
    { id: 2, title: 'Date & Location', description: 'When and where' },
    { id: 3, title: 'Details', description: 'Tickets and capacity' },
];

// Step animation variants
const stepVariants = {
    enter: (direction) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: (direction) => ({
        x: direction < 0 ? 300 : -300,
        opacity: 0,
        transition: { duration: 0.3 },
    }),
};

// Categories
const categories = [
    'Technology', 'Music', 'Business', 'Sports', 'Arts', 'Food', 'Education', 'Other'
];

const CreateEvent = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [currentStep, setCurrentStep] = useState(1);
    const [direction, setDirection] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        date: '',
        time: '',
        endTime: '',
        location: '',
        address: '',
        price: '',
        capacity: '',
        image: null,
        imagePreview: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                image: file,
                imagePreview: URL.createObjectURL(file),
            }));
        }
    };

    const validateStep = (step) => {
        const newErrors = {};

        if (step === 1) {
            if (!formData.title) newErrors.title = 'Event title is required';
            if (!formData.description) newErrors.description = 'Description is required';
            if (!formData.category) newErrors.category = 'Please select a category';
        }

        if (step === 2) {
            if (!formData.date) newErrors.date = 'Date is required';
            if (!formData.time) newErrors.time = 'Start time is required';
            if (!formData.location) newErrors.location = 'Venue name is required';
        }

        if (step === 3) {
            if (!formData.capacity) newErrors.capacity = 'Capacity is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setDirection(1);
            setCurrentStep((prev) => Math.min(prev + 1, 3));
        } else {
            toast.error('Please fill in all required fields');
        }
    };

    const prevStep = () => {
        setDirection(-1);
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep(currentStep)) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Create event with pending status
            const newEvent = {
                id: Date.now(),
                title: formData.title,
                description: formData.description,
                category: formData.category,
                date: formData.date,
                time: formData.time,
                endTime: formData.endTime,
                location: formData.location,
                address: formData.address,
                price: parseFloat(formData.price) || 0,
                capacity: parseInt(formData.capacity),
                attendees: 0,
                status: 'pending', // Pending admin approval
                image: formData.imagePreview || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
                createdAt: new Date().toISOString(),
                createdBy: JSON.parse(localStorage.getItem('user'))?.email || 'user@demo.com',
            };

            // Save to localStorage
            const existingEvents = JSON.parse(localStorage.getItem('pendingEvents') || '[]');
            existingEvents.push(newEvent);
            localStorage.setItem('pendingEvents', JSON.stringify(existingEvents));

            toast.success('Event Submitted!', 'Your event is pending admin approval');
            navigate('/events');
        } catch (error) {
            toast.error('Failed to create event', 'Please try again');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatedPage className="create-event-page">
            <div className="container">
                <motion.div
                    className="create-event-container"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header */}
                    <div className="create-header">
                        <h1>Create New Event</h1>
                        <p>Fill in the details to publish your event</p>
                    </div>

                    {/* Progress Steps */}
                    <div className="progress-steps">
                        {steps.map((step, index) => (
                            <div
                                key={step.id}
                                className={`progress-step ${currentStep >= step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
                            >
                                <div className="step-indicator">
                                    {currentStep > step.id ? (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 500 }}
                                        >
                                            <FiCheck />
                                        </motion.div>
                                    ) : (
                                        step.id
                                    )}
                                </div>
                                <div className="step-info">
                                    <span className="step-title">{step.title}</span>
                                    <span className="step-description">{step.description}</span>
                                </div>
                                {index < steps.length - 1 && <div className="step-connector" />}
                            </div>
                        ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="create-form">
                        <AnimatePresence mode="wait" custom={direction}>
                            {/* Step 1: Basic Info */}
                            {currentStep === 1 && (
                                <motion.div
                                    key="step1"
                                    className="form-step"
                                    custom={direction}
                                    variants={stepVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                >
                                    <div className="form-group">
                                        <AnimatedInput
                                            label="Event Title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="Give your event a catchy name"
                                            error={errors.title}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Describe what attendees can expect..."
                                            className={`form-textarea ${errors.description ? 'error' : ''}`}
                                            rows={5}
                                        />
                                        {errors.description && (
                                            <span className="error-message">{errors.description}</span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Category</label>
                                        <div className="category-grid">
                                            {categories.map((category) => (
                                                <motion.button
                                                    key={category}
                                                    type="button"
                                                    className={`category-option ${formData.category === category ? 'selected' : ''}`}
                                                    onClick={() => setFormData((prev) => ({ ...prev, category }))}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    {category}
                                                </motion.button>
                                            ))}
                                        </div>
                                        {errors.category && (
                                            <span className="error-message">{errors.category}</span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Event Image</label>
                                        <div className="image-upload">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                id="event-image"
                                                className="image-input"
                                            />
                                            <label htmlFor="event-image" className="image-upload-label">
                                                {formData.imagePreview ? (
                                                    <img src={formData.imagePreview} alt="Preview" className="image-preview" />
                                                ) : (
                                                    <div className="image-placeholder">
                                                        <FiImage size={32} />
                                                        <span>Click to upload event image</span>
                                                        <span className="image-hint">Recommended: 1200x600px</span>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Date & Location */}
                            {currentStep === 2 && (
                                <motion.div
                                    key="step2"
                                    className="form-step"
                                    custom={direction}
                                    variants={stepVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                >
                                    <div className="form-row">
                                        <div className="form-group">
                                            <AnimatedInput
                                                label="Event Date"
                                                type="date"
                                                name="date"
                                                value={formData.date}
                                                onChange={handleChange}
                                                error={errors.date}
                                                icon={<FiCalendar size={18} />}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <AnimatedInput
                                                label="Start Time"
                                                type="time"
                                                name="time"
                                                value={formData.time}
                                                onChange={handleChange}
                                                error={errors.time}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <AnimatedInput
                                                label="End Time"
                                                type="time"
                                                name="endTime"
                                                value={formData.endTime}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <AnimatedInput
                                            label="Venue Name"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder="e.g., Convention Center"
                                            error={errors.location}
                                            icon={<FiMapPin size={18} />}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <AnimatedInput
                                            label="Full Address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="Street address, city, state, zip"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Tickets & Capacity */}
                            {currentStep === 3 && (
                                <motion.div
                                    key="step3"
                                    className="form-step"
                                    custom={direction}
                                    variants={stepVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                >
                                    <div className="form-row">
                                        <div className="form-group">
                                            <AnimatedInput
                                                label="Ticket Price"
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                placeholder="0 for free events"
                                                icon={<FiDollarSign size={18} />}
                                            />
                                            <span className="form-hint">Leave empty or 0 for free events</span>
                                        </div>
                                        <div className="form-group">
                                            <AnimatedInput
                                                label="Capacity"
                                                type="number"
                                                name="capacity"
                                                value={formData.capacity}
                                                onChange={handleChange}
                                                placeholder="Maximum attendees"
                                                error={errors.capacity}
                                                icon={<FiUsers size={18} />}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Preview Card */}
                                    <div className="preview-section">
                                        <h3>Event Preview</h3>
                                        <div className="preview-card">
                                            <div className="preview-image">
                                                {formData.imagePreview ? (
                                                    <img src={formData.imagePreview} alt="Event" />
                                                ) : (
                                                    <div className="preview-placeholder">
                                                        <FiImage size={40} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="preview-content">
                                                <span className="preview-category">{formData.category || 'Category'}</span>
                                                <h4>{formData.title || 'Event Title'}</h4>
                                                <p>{formData.date && formData.time ? `${formData.date} at ${formData.time}` : 'Date & Time'}</p>
                                                <p>{formData.location || 'Venue'}</p>
                                                <span className="preview-price">
                                                    {formData.price ? `$${formData.price}` : 'Free'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <div className="form-navigation">
                            {currentStep > 1 && (
                                <AnimatedButton
                                    type="button"
                                    variant="secondary"
                                    onClick={prevStep}
                                    icon={<FiArrowLeft />}
                                >
                                    Previous
                                </AnimatedButton>
                            )}

                            <div className="nav-spacer" />

                            {currentStep < 3 ? (
                                <AnimatedButton
                                    type="button"
                                    variant="primary"
                                    onClick={nextStep}
                                    icon={<FiArrowRight />}
                                >
                                    Continue
                                </AnimatedButton>
                            ) : (
                                <AnimatedButton
                                    type="submit"
                                    variant="primary"
                                    loading={isSubmitting}
                                    icon={<FiCheck />}
                                >
                                    Submit for Approval
                                </AnimatedButton>
                            )}
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatedPage>
    );
};

export default CreateEvent;
