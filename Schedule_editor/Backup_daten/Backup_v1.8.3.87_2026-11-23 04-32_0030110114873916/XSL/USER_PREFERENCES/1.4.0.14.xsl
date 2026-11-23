<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/user_preferences/preference[@tag='mig_pulse_deadBand_volts']" />
	<xsl:template match="/user_preferences/preference[@tag='mig_pulse_slowBand_volts']" />
	<xsl:template match="/user_preferences/preference[@tag='mig_pulse_low_sensitivity']" />
	<xsl:template match="/user_preferences/preference[@tag='mig_pulse_high_sensitivity']" />
	<xsl:template match="/user_preferences/preference[@tag='mig_pulse_start_delay_s']" />
	<xsl:template match="/user_preferences/preference[@tag='mig_pulse_stop_delay_s']" />
	<xsl:template match="/user_preferences/preference[@tag='mig_pulse_exponential_smoothing']" />
	<xsl:template match="/user_preferences/preference[@tag='mig_pulse_p_gain']" />
	<xsl:template match="/user_preferences/preference[@tag='mig_pulse_i_gain']" />
	<xsl:template match="/user_preferences/preference[@tag='mig_pulse_d_gain']" />
	<xsl:template match="/user_preferences/preference[@tag='mig_pulse_i_sat_gain']" />
	<xsl:template match="/user_preferences/preference[@tag='mig_pulse_detect_short_volts']" />
	<xsl:template match="/user_preferences/preference[@tag='mig_pulse_clear_short_volts']" />
	<xsl:template match="/user_preferences/preference[@tag='mig_pulse_clear_short_ramp_rate']" />
	<xsl:template match="/user_preferences/preference[@tag='mig_pulse_exponential_decay_period']" />
	<xsl:template match="/user_preferences/preference[@tag='mig_pulse_dynamics_voltage_threshold']" />
	<xsl:template match="/user_preferences/preference[@tag='mig_pulse_dynamics_wetting_amps']" />
	<xsl:template match="/user_preferences/preference[@tag='mig_pulse_dynamics_wetting_time']" />
	<xsl:template match="/user_preferences/preference[@tag='mig_pulse_dynamics_wetting_ramp_rate']" />
	<xsl:template match="/user_preferences/preference[@tag='mig_pulse_dynamics_max_amps']" />
	
	<xsl:template match="/user_preferences/preference[@tag='can_enable_gmaw_p_open_loop_mode']/@tag">
		<xsl:attribute name="tag">
			<xsl:value-of select="'can_toggle_mig_pulse_open_loop_from_pendant'"/>
		</xsl:attribute>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>
</xsl:stylesheet>