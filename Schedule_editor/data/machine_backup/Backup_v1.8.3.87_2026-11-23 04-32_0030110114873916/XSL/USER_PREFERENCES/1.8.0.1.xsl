<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line-->

	<xsl:template match="/user_preferences/preference[@tag='trace_log_file_limit']" />
	<xsl:template match="/user_preferences/preference[@tag='event_log_file_limit']" />
	<xsl:template match="/user_preferences/preference[@tag='data_log_file_limit']" />
	
	<xsl:template match="/user_preferences">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<xsl:choose>
				<xsl:when test="/user_preferences/preference[@tag='closed_weld_path_start_tolerance']"/>
				<xsl:otherwise>
					<preference tag="closed_weld_path_start_tolerance" value="0.5"/>
				</xsl:otherwise>
			</xsl:choose>
			<xsl:choose>
				<xsl:when test="/user_preferences/preference[@tag='free_disk_space_percent_warning']"/>
				<xsl:otherwise>
					<preference tag="free_disk_space_percent_warning" value="30.0"/>
				</xsl:otherwise>
			</xsl:choose>
			<xsl:choose>
				<xsl:when test="/user_preferences/preference[@tag='free_disk_space_percent_error']"/>
				<xsl:otherwise>
					<preference tag="free_disk_space_percent_error" value="20.0"/>
				</xsl:otherwise>
			</xsl:choose>
			<xsl:choose>
				<xsl:when test="/user_preferences/preference[@tag='scheduled_system_backup_frequency']"/>
				<xsl:otherwise>
					<preference tag="scheduled_system_backup_frequency" value="0"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:copy>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>
</xsl:stylesheet>