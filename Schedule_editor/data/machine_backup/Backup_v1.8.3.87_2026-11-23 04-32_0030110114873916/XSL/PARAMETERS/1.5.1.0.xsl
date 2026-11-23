<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output  omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/Parameters/param[@id='198923']">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/Parameters/param[@id='272654']"/>
			<xsl:otherwise>
				<param id="272654">
					<name>HEAT INPUT HIGH FAULT</name>
					<short_name>HEAT INPUT HIGH FAULT</short_name>
					<desc>The tolerance value that creates the upper limit of HEAT INPUT HIGH. If the measured value sample falls outside of this band it immediately ends the weld and raises an error message.</desc>
				</param>
				<param id="272655">
					<name>HEAT INPUT LOW FAULT</name>
					<short_name>HEAT INPUT LOW FAULT</short_name>
					<desc>The tolerance value that creates the upper limit of HEAT INPUT LOW. If the measured value sample falls outside of this band it immediately ends the weld and raises an error message.</desc>
				</param>
				<param id="202682">
					<name>SERVO 0 BRAKE RELAY</name>
					<short_name></short_name>
					<desc>A digital output that specifies that the servo will use the brake relay when the servo is disabled.</desc>
				</param>
				<param id="202683">
					<name>SERVO 1 BRAKE RELAY</name>
					<short_name></short_name>
					<desc>A digital output that specifies that the servo will use the brake relay when the servo is disabled.</desc>
				</param>
				<param id="202684">
					<name>SERVO 2 BRAKE RELAY</name>
					<short_name></short_name>
					<desc>A digital output that specifies that the servo will use the brake relay when the servo is disabled.</desc>
				</param>
				<param id="202685">
					<name>SERVO 3 BRAKE RELAY</name>
					<short_name></short_name>
					<desc>A digital output that specifies that the servo will use the brake relay when the servo is disabled.</desc>
				</param>
				<param id="202686">
					<name>SERVO 4 BRAKE RELAY</name>
					<short_name></short_name>
					<desc>A digital output that specifies that the servo will use the brake relay when the servo is disabled.</desc>
				</param>
				<param id="202687">
					<name>SERVO 5 BRAKE RELAY</name>
					<short_name></short_name>
					<desc>A digital output that specifies that the servo will use the brake relay when the servo is disabled.</desc>
				</param>
				<param id="202688">
					<name>SERVO 6 BRAKE RELAY</name>
					<short_name></short_name>
					<desc>A digital output that specifies that the servo will use the brake relay when the servo is disabled.</desc>
				</param>
				<param id="202689">
					<name>SERVO 7 BRAKE RELAY</name>
					<short_name></short_name>
					<desc>A digital output that specifies that the servo will use the brake relay when the servo is disabled.</desc>
				</param>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>