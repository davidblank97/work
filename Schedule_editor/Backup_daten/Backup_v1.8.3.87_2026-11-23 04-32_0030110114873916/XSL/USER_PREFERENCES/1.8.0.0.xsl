<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line-->

	<xsl:template match="/user_preferences/preference[@tag='enable_verbose_channel1']"/>
	<xsl:template match="/user_preferences/preference[@tag='enable_verbose_channel2']"/>
	<xsl:template match="/user_preferences/preference[@tag='enable_verbose_channel3']"/>
	<xsl:template match="/user_preferences/preference[@tag='enable_verbose_channel4']"/>
	<xsl:template match="/user_preferences/preference[@tag='enable_verbose_channel5']"/>
	<xsl:template match="/user_preferences/preference[@tag='enable_verbose_channel6']"/>
	<xsl:template match="/user_preferences/preference[@tag='enable_verbose_channel7']"/>
	<xsl:template match="/user_preferences/preference[@tag='enable_verbose_channel8']"/>
	<xsl:template match="/user_preferences/preference[@tag='enable_verbose_acc']"/>
	<xsl:template match="/user_preferences/preference[@tag='enable_verbose_power_supply']"/>
	<xsl:template match="/user_preferences/preference[@tag='enable_verbose_groove_tracker']"/>
	<xsl:template match="/user_preferences/preference[@tag='enable_verbose_closed_loop']"/>
	<xsl:template match="/user_preferences/preference[@tag='enable_verbose_groove_positioning']"/>
	<xsl:template match="/user_preferences/preference[@tag='enable_verbose_weldhead']"/>
	<xsl:template match="/user_preferences/preference[@tag='enable_verbose_datalog']"/>
	<xsl:template match="/user_preferences/preference[@tag='enable_verbose_data_subscriber']"/>

	<xsl:template match="/user_preferences/preference[@tag='servo_velocity_rise_time_smoothing_factor']">
		<xsl:copy-of select="."/>
		<preference tag="enabled_verbose_id" />
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>
</xsl:stylesheet>