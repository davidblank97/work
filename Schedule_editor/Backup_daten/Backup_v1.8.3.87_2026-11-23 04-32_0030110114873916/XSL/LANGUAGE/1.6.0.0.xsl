<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	
	<xsl:template match="/language/text[@id='509']">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/language/text[@id='510']"/>
			<xsl:otherwise>
				<text id="510">
					<content>LAST BACKUP</content>
					<desc>Refers to the time of when the last restore point was created.</desc>
				</text>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:choose>
			<xsl:when test="/language/text[@id='511']"/>
			<xsl:otherwise>
				<text id="511">
					<content>TRIM</content>
					<desc>A schedule parameter for the DIP process.</desc>
				</text>
			</xsl:otherwise>
		</xsl:choose>
		<text id="512">
			<content>FILE</content>
			<desc>A computer resource for recording data in a computer storage device.</desc>
		</text>
		<text id="513">
			<content>MEMORY</content>
			<desc>Location where data is temporarily stored on a computer for later use.</desc>
		</text>
		<text id="514">
			<content>ID</content>
			<desc>Short for identifier.</desc>
		</text>
		<text id="515">
			<content>SHIELD GAS</content>
			<desc>Refers to the Shield Gas used for welding.</desc>
		</text>
		<text id="516">
			<content>TRAIL GAS</content>
			<desc>Refers to the Trail Gas used for welding.</desc>
		</text>
		<text id="517">
			<content>PLASMA GAS</content>
			<desc>Refers to the Plasma Gas used for welding.</desc>
		</text>
		<text id="518">
			<content>BACKUP GAS</content>
			<desc>Refers to the Backup Gas used for welding.</desc>
		</text>
		<text id="519">
			<content>ADJUST GAS FLOW TO FIRST CALIBRATION POINT</content>		
			<desc>Change the gas flow to the flow needed for the first calibration measurement.</desc>
		</text>
		<text id="520">
			<content>ADJUST GAS FLOW TO SECOND CALIBRATION POINT</content>
			<desc>Change the gas flow to the flow needed for the second calibration measurement.</desc>
		</text>
		<text id="521">
			<content>WIRE MANIPULATOR IN/OUT</content>
			<desc>An axis on the robot. The axis that positions wire feeder while welding.</desc>
		</text>
		<text id="522">
			<content>WIRE MANIPULATOR UP/DOWN</content>
			<desc>An axis on the robot. The axis that positions wire feeder while welding.</desc>
		</text>		
	</xsl:template>

	<xsl:template match="language/text[@id='1048588']">
		<text id="1048588">
			<content>Selected logs have been written to the current trace log file.</content>
			<desc>Message text notifying the user that the selected logs have been written to the trace log file.</desc>
		</text>
	</xsl:template>

	<xsl:template match="language/text[@id='1048589']">
		<text id="1048589">
			<content>Please be advised, writing to the trace log file can take several minutes to complete.</content>
			<desc>Message text asking user which type of logs to write to the trace log file.</desc>
		</text>
	</xsl:template>
	<xsl:template match="language/text[@id='150']">
		<text id="150">
			<content>WRITE TO FILE</content>
			<desc>A button to add extra in-depth trace logs to the file.</desc>
		</text>
	</xsl:template>

	<xsl:template match="language/text[@id='1048604']">
		<xsl:copy-of select="."/>
		<text id="1048605">
			<content>Writing logs to file...</content>
			<desc>Message text notifying the user that the system is writing logs to the file.</desc>
		</text>
		<text id="1048606">
			<content>Select how you would like the verbose logs to be sorted.</content>
			<desc>Message text notifying the user that the system is writing logs to the file.</desc>
		</text>
	</xsl:template>

	<xsl:template match="/language/text[@id='65591']/@id">
		<xsl:attribute name="id">
			<xsl:value-of select="'65595'"/>
		</xsl:attribute>
	</xsl:template>
	<xsl:template match="/language/text[@id='65592']/@id">
		<xsl:attribute name="id">
			<xsl:value-of select="'65596'"/>
		</xsl:attribute>
	</xsl:template>
	<xsl:template match="/language/text[@id='65593']/@id">
		<xsl:attribute name="id">
			<xsl:value-of select="'65597'"/>
		</xsl:attribute>
	</xsl:template>
	
	<xsl:template match="language/text[@id='65590']">
		<xsl:copy-of select="."/>
		<text id="65591">
			<content>Ensure the above gas is connected to the %1 line. If you want to calibrate with a different gas, abort and select a new gas from the settings screen.</content>
			<desc>%1 = type of gas being calibrated.</desc>
		</text>
		<text id="65592">
			<content>Set the amount of gas flowing to be about 20% of the maximum value.</content>
			<desc>Message text prompting the user to adjust the gas flow output to be 20% of the system's maximum voltage. This is a step of a calibration procedure.</desc>
		</text>
		<text id="65593">
			<content>Increase the amount of gas flowing before continuing.</content>
			<desc>Message text prompting the user to increase the amount of gas flowing. This is a step of a calibration procedure.</desc>
		</text>
		<text id="65594">
			<content>Using a flow meter, measure the gas flow and enter it in the input field above.</content>
			<desc>Message text prompting the user to measure the gas flow using a flow meter. This is a step of a calibration procedure.</desc>
		</text>
	</xsl:template>

	<xsl:template match="language[@localeID='en-CA']">
		<xsl:copy>
			<xsl:attribute name="localeCode">4105</xsl:attribute>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

	<xsl:template match="language[@localeID='fr-FR']">
		<xsl:copy>
			<xsl:attribute name="localeCode">1036</xsl:attribute>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>	
	
	<xsl:template match="language/text[@id='1048604']">
		<xsl:copy-of select="."/>
		<text id="1048605">
			<content>Writing logs to file...</content>
			<desc>Message text notifying the user that the system is writing logs to the file.</desc>
		</text>
		<text id="1048606">
			<content>Select how you would like the verbose logs to be sorted.</content>
			<desc>Message text notifying the user that the system is writing logs to the file.</desc>
		</text>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>